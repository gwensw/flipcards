import flashcards from 'flashcards';  // eslint-disable-line
import UserSettings from './settings';
import Render from './render';

// keep track of incorrect cards to allow retrying of wrong answers at the end
let cardsToRetry = [];
let numToRetry = 0;
let currentCard = false;
let totalCards;

function getName() {
  return flashcards.exposeDeck().name;
}

function getSettings() {
  const name = getName();
  return UserSettings.get(name);
}

const Play = {
  setup(name, minDiff, maxDiff, total) {
    // open deck - optionally with mindiff and maxdiff
    flashcards.openDeck(name, minDiff, maxDiff);
    // apply saved state if it exists (this will apply the saved mindiff and maxdiff too)
    const usersettings = UserSettings.get(name);
    const { state } = usersettings;
    if (state !== undefined) {
      flashcards.setSessionInfo(state);
    }
    // calculate and internally save number of cards to test in session
    totalCards = total || flashcards.deckLength();
    // flip deck if user settings indicate
    if (usersettings.qSide !== flashcards.settings.questionSide) {
      flashcards.flipDeck();
    }
    // render the basic page, passing in whether in autocheck or selfcheck mode
    const { autocheck } = usersettings;
    Render.trainingView(autocheck);
    Render.header({
      backlink: '#',
      deckTitle: flashcards.getDisplayName(),
      inTrainingMode: true,
      name
    });
    // draw a card from the deck and render it (or results screen)
    this.drawNextCard();
  },
  drawNextCard() {
    this.recordProgress();
    currentCard = numToRetry ? flashcards.draw(cardsToRetry.splice(0, 1)[0]) : flashcards.drawNext();
    if (!currentCard) {
      // if there are no cards left, render the results
      const session = flashcards.getSessionInfo();
      Render.results(session.correct, session.incorrect);
      Render.controls({ isResults: true, retry: session.incorrect });
      // TODO: focus on retry button if some incorrect, shuffle button otherwise
    } else {
      Render.nextCard(currentCard.question[0], currentCard.difficulty);
      Render.controls();
    }
  },
  // autosaves progress and triggers progress bar render
  recordProgress() {
    const name = getName();
    const settings = getSettings();
    settings.state = flashcards.getSessionInfo();
    UserSettings.update(name, settings);
    Render.progress(settings.state, totalCards, numToRetry, flashcards.deckLength());
  },
  // reveal question (as a result of user flipping back, so no buttons redrawn)
  showQuestion() {
    Render.question(currentCard.question[0], currentCard.difficulty);
  },
  // reveal answer (in self-check mode)
  showAnswer() {
    const settings = getSettings();
    const a = flashcards.revealAnswer();
    const aText = settings.firstanswer ? a.answers.slice(0, 1) : a.answers;
    Render.answer(aText, currentCard.difficulty);
    Render.controls({ isQuestion: false });
  },
  // process user-submitted outcome
  processResult(outcome) {
    const submission = outcome === 'correct' ? flashcards.revealAnswer().answers[0] : '';
    flashcards.checkAnswer(submission);
    this.drawNextCard();
  },
  // handles clicks on the shuffle button
  shuffle() {
    // remove record of incorrect cards
    this.reset();
    // shuffle the deck
    flashcards.shuffle();
  },
  // retry incorrect cards
  retry() {
    cardsToRetry = flashcards.getSessionInfo().incorrectCards;
    numToRetry = cardsToRetry.length;
    Render.trainingView();
    flashcards.openDeck(getName());
    this.drawNextCard();
  },
  // clear session when user ends training
  reset() {
    const name = getName();
    const settings = getSettings();
    settings.state = undefined;
    UserSettings.update(name, settings);
    cardsToRetry = [];
    numToRetry = 0;
  }
};

export default Play;
