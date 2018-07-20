// changes DOM elements, often in response to routing

import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';
import editCardTemplate from '../templates/editCard.handlebars';

const main = document.querySelector('.main');
const header = document.querySelector('.header');

const Render = {
  header(hasBacklink = false, deckTitle = '', inEditMode = false) {
    const context = { hasBacklink, deckTitle, inEditMode };
    header.innerHTML = headerTemplate(context);
  },
  decks(context) {
    main.innerHTML = decksTemplate(context);
  },
  editView(cards) {
    main.innerHTML = '';
    const len = cards.length;
    for (let i = 0; i < len; i += 1) {
      const context = {
        index: i,
        side1: cards[i].side1.join(' / '),
        side2: cards[i].side2.join(' / '),
        difficulty: cards[i].difficulty
      };
      main.insertAdjacentHTML('afterbegin', editCardTemplate(context));
    }
  }
};

export default Render;
