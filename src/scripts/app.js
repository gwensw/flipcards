import flashcards from 'flashcards';  // eslint-disable-line
import { Router } from 'director/build/director';
import createSampleDecks from './setup';
import UserSettings from './settings';
import Render from './render';
import '../styles/main.sass';
import Listeners from './listeners';
import Play from './play';

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

function selectDifficulty(name) {
  flashcards.openDeck(name);
  const usersettings = UserSettings.get(name);
  // if a saved state exists for this deck, go straight to train
  if (usersettings.state !== undefined) {
    window.location.href = `#/train/${name}`;
  } else {
    // render the difficulty selection modal
    Render.diffselect(flashcards.getDisplayName(), flashcards.deckLength());
    // TODO: use a listener to change the button number and apply a class 'disable' if necessary
    // TODO: diffselect confirmation should trigger flashcards.openDeck(name, minDiff, maxDiff)
    // TODO: then it should change href to 'train'
  }
}

function train(name) {
  // open (in case user loads the train url directly)
  flashcards.openDeck(name);
  // apply saved state if it exists
  const usersettings = UserSettings.get(name);
  if (usersettings.state !== undefined) {
    flashcards.setSessionInfo(usersettings.state);
  }
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
  Play.drawNextCard();
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
  Render.settings(name, flashcards.getDisplayName());
}

const routes = {
  '/': select,
  '/train/:deckname': train,
  '/diffselect/:deckname': selectDifficulty,
  '/edit/:deckname': edit,
  '/editcurrent/:deckname': editcurrent,
  '/editnew': editnew,
  'edit/:deckname/settings': showSettings
};

Router(routes).init('/');
