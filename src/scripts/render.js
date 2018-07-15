import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';

document.querySelector('.header').innerHTML += headerTemplate();

const Render = {
  decks(context) {
    document.querySelector('.main').innerHTML = decksTemplate(context);
  }

};

export default Render;
