import flashcards from 'flashcards';  // eslint-disable-line
import createSampleDecks from './setup';
import setupUserSettings from './settings';
import truncate from './truncate';
import Render from './render';
import '../styles/main.sass';
import indexCardIcon from '../assets/index-card-icon.svg'; // eslint-disable-line


flashcards.settings.adjustDifficultyUp = 2; // one steps forward, two steps back
createSampleDecks(); // create sample decks if homepage is empty
setupUserSettings(flashcards.listDecks()); // default user settings for all decks

// initiate rendering of home interface with deck list
function select() {
  const sortedDeck = flashcards.listDecks().sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
  for (let i = 0; i < sortedDeck.length; i += 1) {
    sortedDeck[i].shortname = truncate(sortedDeck[i].displayName);
  }
  const context = {
    deck: sortedDeck
  };
  Render.decks(context);
  Render.header();
}


select();
