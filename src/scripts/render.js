// changes DOM elements, often in response to routing
import truncate from './truncate';
import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';
import editCardTemplate from '../templates/editCard.handlebars';

const main = document.querySelector('.main');
const header = document.querySelector('.header');

function growOnInput() {
  const newHeight = Math.max(this.scrollHeight, this.offsetHeight);
  this.style.height = `${newHeight}px`;
}

function shrinkOnFocusout() {
  this.removeAttribute('style');
}

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
    // make textarea grow on focus/input, and obey stylesheet otherwise
    document.querySelectorAll('.edit__input').forEach((el) => {
      el.addEventListener('focus', growOnInput);
      el.addEventListener('input', growOnInput);
      el.addEventListener('focusout', shrinkOnFocusout);
    });
  },
  updateDiffColour(el, diffnum) {
    const oldClass = el.classList.toString().match(/edit__selector--diff./)[0];
    el.classList.remove(oldClass);
    el.classList.add(`edit__selector--diff${diffnum}`);
  },
  deletedCard(cardToDelete) {
    main.removeChild(cardToDelete);
  }
};

export default Render;
