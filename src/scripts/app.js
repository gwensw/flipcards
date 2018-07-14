import flashcards from 'flashcards';  // eslint-disable-line
import createSampleDecks from './setup';
import '../styles/main.sass';
// import indexCardIcon from '../assets/index-card-icon.svg';
// import testTemplate from '../templates/testrun.handlebars';

createSampleDecks(); // create sample decks if homepage is empty

// document.querySelector('.imagetest').innerHTML = `<img src='${indexCardIcon}'>`;
// document.querySelector('.handlebarstest').innerHTML += testTemplate({ title: 'Hi world', body: 'handlebars here' });
