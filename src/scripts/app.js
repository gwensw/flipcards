import flashcards from 'flashcards';  // eslint-disable-line
import { Router } from 'director/build/director';
import createSampleDecks from './setup';
import userSettings from './settings';
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
userSettings.setup(flashcards.listDecks());

/*------------------
BIND EVENT LISTENERS
-------------------*/

// handle changes to deck display name
document.querySelector('.header').addEventListener('change', (e) => {
  flashcards.setDisplayName(e.target.value);
  e.stopPropagation();
});

// allow enter key for input in header
document.querySelector('.header').addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    e.target.blur();
  }
});

// handle updates to cards in edit mode
document.querySelector('.main').addEventListener('change', (e) => {
  Edit.cardtext(e);
});

// handles clicks - for card deletion or addition
document.querySelector('.main').addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('js-delete')) {
    Edit.deleteCard(el);
  }
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

function editnew() {
  const newName = Math.floor(Date.now() / 1000).toString();
  flashcards.openDeck(newName);
  flashcards.setDisplayName('New Deck');
  userSettings.update(newName);
  window.location.href = `#/edit/${newName}`;
}

const routes = {
  '/': select,
  '/train/:deckname': train,
  '/edit/:deckname': edit,
  '/editnew': editnew
};

Router(routes).init('/');
