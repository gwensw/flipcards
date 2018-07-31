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
      // TODO: if there are no cards left, render the end results screen
      console.log('no cards left');
    } else {
      this.showQuestion();
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
  // submit answer for evaluation (in auto-check mode)
  // submitAnswer() {
  //   const settings = getSettings();
  //   const attempt = document.querySelector('.answer__input');
  //   const result = flashcards.checkAnswer(attempt.value.trim()),
  //         answers = usersettings.firstanswer ? [result.answers[0]] : result.answers;
  //   Render.answer(answers, result.newDifficulty, result.outcome);
  //   document.querySelector('#card').addEventListener('click', drawNextCard);
  //   recordProgress();
  // },
  // reveal question (could be someone flipping back, so no buttons redrawn)
  showQuestion() {
    Render.question(currentCard.question[0], currentCard.difficulty);
  },
  // reveal answer (in self-check mode)
  showAnswer() {
    const settings = getSettings();
    const a = flashcards.revealAnswer();
    const aText = settings.firstanswer ? a.answers.slice(0, 1) : a.answers;
    Render.answer(aText);
    Render.controls({ isQuestion: false });
  }
};

export default Play;
