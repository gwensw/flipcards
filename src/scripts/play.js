import flashcards from 'flashcards';  // eslint-disable-line
import UserSettings from './settings';
import Render from './render';

// keep track of incorrect cards to allow retrying of wrong answers at the end
// TODO: change these back to let
const cardsToRetry = [];
const numToRetry = 0;

const Play = {
  drawNextCard() {
    this.recordProgress();
    const card = numToRetry ? flashcards.draw(cardsToRetry.splice(0, 1)[0]) : flashcards.drawNext();
    if (!card) {
      // TODO: if there are no cards left, render the end results screen
      console.log('no cards left');
    } else {
      Render.question(card.question[0], card.difficulty);
    }
  },
  // autosaves progress and triggers progress bar render
  recordProgress() {
    const { name } = flashcards.exposeDeck();
    const settings = UserSettings.get(name);
    settings.state = flashcards.getSessionInfo();
    UserSettings.update(name, settings);
    Render.progress(settings.state, flashcards.deckLength(), numToRetry);
  }
};

export default Play;
