// changes DOM elements, often in response to routing

import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';

const Render = {
  header() {
    document.querySelector('.header').innerHTML = headerTemplate();
  },
  decks(context) {
    document.querySelector('.main').innerHTML = decksTemplate(context);
  }

};

export default Render;
