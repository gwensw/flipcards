// changes DOM elements, often in response to routing
import truncate from './truncate';
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
  decks(decks) {
    const sortedDecks = decks.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
    sortedDecks.map((deck) => {
      deck.shortname = truncate(deck.displayName); // eslint-disable-line no-param-reassign
      return deck;
    });
    const context = {
      deck: sortedDecks
    };
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
