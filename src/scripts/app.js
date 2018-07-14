import flashcards from 'flashcards';  // eslint-disable-line
import createSampleDecks from './setup';
import '../styles/main.sass';
import indexCardIcon from '../assets/index-card-icon.svg'; // eslint-disable-line
import headerTemplate from '../templates/header.handlebars';

createSampleDecks(); // create sample decks if homepage is empty

document.querySelector('.header').innerHTML += headerTemplate();
