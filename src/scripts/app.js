import test from './examplemodule';
import '../styles/main.sass';

document.querySelector('h1').innerHTML = `${test()}`;
