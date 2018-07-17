import flashcards from 'flashcards';  // eslint-disable-line
import createSampleDecks from './setup';
import setupUserSettings from './settings';
import truncate from './truncate';
import Render from './render';
import '../styles/main.sass';
import indexCardIcon from '../assets/index-card-icon.svg'; // eslint-disable-line

// adjust settings for project
flashcards.settings.adjustDifficultyUp = 2;
flashcards.settings.lowestDifficulty = 1;
flashcards.settings.defaultDifficulty = 3;
flashcards.settings.highestDifficulty = 5;

createSampleDecks(); // create sample decks if homepage is empty
setupUserSettings(flashcards.listDecks()); // default user settings for all decks

// initiate rendering of home interface with deck list
function select() {
  const sortedDecks = flashcards.listDecks().sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
  for (let i = 0; i < sortedDecks.length; i += 1) {
    sortedDecks[i].shortname = truncate(sortedDecks[i].displayName);
  }
  const context = {
    deck: sortedDecks
  };
  Render.decks(context);
  Render.header();
}

select();
