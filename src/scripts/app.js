import flashcards from 'flashcards';  // eslint-disable-line
import { Router } from 'director/build/director';
import createSampleDecks from './setup';
import UserSettings from './settings';
import Render from './render';
import '../styles/main.sass';
import Listeners from './listeners';
import Play from './play';
import Difficulty from './difficulty';

// adjust settings for project
flashcards.settings.adjustDifficultyUp = 2;
flashcards.settings.lowestDifficulty = 1;
flashcards.settings.defaultDifficulty = 3;
flashcards.settings.highestDifficulty = 5;

// create sample decks and backfill default user settings
createSampleDecks();
UserSettings.setup(flashcards.listDecks());

/*------------------
BIND EVENT LISTENERS
-------------------*/

Listeners.init();

/*------
HELPERS
-------*/


/*---------
  ROUTING
----------*/

function select() {
  Render.decks(flashcards.listDecks());
  Render.header();
}

function train(name) {
  const { state } = UserSettings.get(name);
  if (state !== undefined) {
    // launch training session directly if saved state exists
    Play.setup(name);
  } else {
    // render the difficulty selection modal
    Difficulty.init(name);
  }
}

function edit(name, backlink = '#') {
  flashcards.openDeck(name);
  const { cards } = flashcards.exposeDeck();
  Render.editView(cards);
  Render.header({
    backlink,
    deckTitle: flashcards.getDisplayName(),
    inEditMode: true,
    name
  });
}

function editnew() {
  const newName = Math.floor(Date.now() / 1000).toString();
  flashcards.openDeck(newName);
  flashcards.setDisplayName('New Deck');
  UserSettings.update(newName);
  window.location.href = `#/edit/${newName}`;
}

function editcurrent(name) {
  edit(name, `#/train/${name}`);
}

function showSettings(name) {
  flashcards.openDeck(name);
  // render modal contents
  Render.settings(name, flashcards.getDisplayName(), UserSettings.get(name));
}

const routes = {
  '/': select,
  '/train/:deckname': train,
  '/edit/:deckname': edit,
  '/editcurrent/:deckname': editcurrent,
  '/editnew': editnew,
  'edit/:deckname/settings': showSettings
};

Router(routes).init('/');
