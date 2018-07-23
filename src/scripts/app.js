import flashcards from 'flashcards';  // eslint-disable-line
import { Router } from 'director/build/director';
import createSampleDecks from './setup';
import setupUserSettings from './settings';
import Render from './render';
import Edit from './edit';
import '../styles/main.sass';

// adjust settings for project
flashcards.settings.adjustDifficultyUp = 2;
flashcards.settings.lowestDifficulty = 1;
flashcards.settings.defaultDifficulty = 3;
flashcards.settings.highestDifficulty = 5;

// create sample decks and backfill default user settings
createSampleDecks();
setupUserSettings(flashcards.listDecks());

/*------------------
BIND EVENT LISTENERS
-------------------*/

// handle updates to cards in edit mode
document.querySelector('.main').addEventListener('change', (e) => {
  Edit.cardtext(e);
});

/*---------
  ROUTING
----------*/

function select() {
  Render.decks(flashcards.listDecks());
  Render.header();
}

function train(num) {
  console.log('train here', num); // eslint-disable-line
}

function edit(name) {
  flashcards.openDeck(name);
  const { cards } = flashcards.exposeDeck();
  Render.editView(cards);
  Render.header(true, flashcards.getDisplayName(), true);
}

function editnew(num) {
  console.log('editnew here', num); // eslint-disable-line
}

const routes = {
  '/': select,
  '/train/:deckname': train,
  '/edit/:deckname': edit,
  '/editnew': editnew
};

Router(routes).init('/');
