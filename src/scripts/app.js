/* eslint-disable */
import flashcards from 'flashcards';
/* eslint-enable */
import test from './examplemodule';
import '../styles/main.sass';
import indexCardIcon from '../assets/index-card-icon.svg';

import testTemplate from '../templates/testrun.handlebars';

document.querySelector('h1').innerHTML = `${test()}`;
document.querySelector('.imagetest').innerHTML = `<img src='${indexCardIcon}'>`;
document.querySelector('.handlebarstest').innerHTML += testTemplate({ title: 'Hi world', body: 'handlebars here' });
console.log(flashcards);
