import flashcards from 'flashcards';  // eslint-disable-line
import { Router } from 'director/build/director';
import createSampleDecks from './setup';
import setupUserSettings from './settings';
import truncate from './truncate';
import Render from './render';
import '../styles/main.sass';

// adjust settings for project
flashcards.settings.adjustDifficultyUp = 2;
flashcards.settings.lowestDifficulty = 1;
flashcards.settings.defaultDifficulty = 3;
flashcards.settings.highestDifficulty = 5;

// create sample decks and backfill default user settings
createSampleDecks();
setupUserSettings(flashcards.listDecks());

/*---------
  ROUTING
----------*/

function select() {
  const sortedDecks = flashcards.listDecks().sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
  sortedDecks.map((deck) => {
    deck.shortname = truncate(deck.displayName); // eslint-disable-line no-param-reassign
    return deck;
  });
  const context = {
    deck: sortedDecks
  };
  Render.decks(context);
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
