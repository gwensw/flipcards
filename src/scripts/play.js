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

// save and return the current session state
function saveState({ overwrite = false } = {}) {
  const name = getName();
  const settings = getSettings();
  settings.state = overwrite ? undefined : flashcards.getSessionInfo();
  settings.cardsToRetry = cardsToRetry;
  settings.numToRetry = numToRetry;
  settings.totalCards = totalCards;
  UserSettings.update(name, settings);
  return settings.state;
}

const Play = {
  setup(name, minDiff, maxDiff, total) {
    // open deck - optionally with mindiff and maxdiff
    flashcards.openDeck(name, minDiff, maxDiff);
    // calculate and internally save number of cards to test in session
    totalCards = total || flashcards.deckLength();
    // apply saved state if it exists (this will apply the saved mindiff and maxdiff too)
    const usersettings = UserSettings.get(name);
    const { state } = usersettings;
    if (state !== undefined) {
      flashcards.setSessionInfo(state);
      totalCards = usersettings.totalCards; // eslint-disable-line
    }
    // if user was in the middle of a retry session, apply this info
    cardsToRetry = usersettings.cardsToRetry || [];
    numToRetry = usersettings.numToRetry || 0;
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
      // Render question text on the new card
      this.showQuestion();
      Render.controls();
    }
  },
  // autosaves progress and triggers progress bar render
  recordProgress() {
    const state = saveState();
    Render.progress(state, totalCards, numToRetry, flashcards.deckLength());
  },
  // reveal question (as a result of user flipping back, so no buttons redrawn)
  showQuestion() {
    const settings = getSettings();
    Render.question(currentCard.question[0], currentCard.difficulty, settings.leftalign);
    console.log(settings.leftalign);
  },
  // reveal answer (in self-check mode)
  showAnswer() {
    const settings = getSettings();
    const a = flashcards.revealAnswer();
    const aText = settings.firstanswer ? a.answers.slice(0, 1) : a.answers;
    Render.answer(aText, currentCard.difficulty, settings.leftalign);
    Render.controls({ isQuestion: false });
  },
  // process user-submitted marking
  processResult(outcome) {
    const submission = outcome === 'correct' ? flashcards.revealAnswer().answers[0] : '';
    flashcards.checkAnswer(submission);
    this.drawNextCard();
  },
  // reset session and shuffle the deck
  shuffle() {
    this.reset();
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
    cardsToRetry = [];
    numToRetry = 0;
    saveState({ overwrite: true });
  }
};

export default Play;
