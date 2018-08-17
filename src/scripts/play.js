import flashcards from 'flashcards';  // eslint-disable-line
import UserSettings from './settings';
import Render from './render';

// keep track of incorrect cards to allow retrying of wrong answers at the end
// TODO: change these back to let
const cardsToRetry = [];
const numToRetry = 0;
let currentCard = false;

function getSettings() {
  const { name } = flashcards.exposeDeck();
  return UserSettings.get(name);
}

const Play = {
  drawNextCard() {
    this.recordProgress();
    currentCard = numToRetry ? flashcards.draw(cardsToRetry.splice(0, 1)[0]) : flashcards.drawNext();
    if (!currentCard) {
      // if there are no cards left, render the results
      const session = flashcards.getSessionInfo();
      Render.results(session.correct, session.incorrect);
      Render.controls({ isResults: true });
    } else {
      Render.nextCard(currentCard.question[0], currentCard.difficulty);
      Render.controls();
    }
  },
  // autosaves progress and triggers progress bar render
  recordProgress() {
    const { name } = flashcards.exposeDeck();
    const settings = UserSettings.get(name);
    settings.state = flashcards.getSessionInfo();
    UserSettings.update(name, settings);
    Render.progress(settings.state, flashcards.deckLength(), numToRetry);
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
  processResult(outcome) {
    const submission = outcome === 'correct' ? flashcards.revealAnswer().answers[0] : '';
    flashcards.checkAnswer(submission);
    this.drawNextCard();
  }
};

export default Play;
