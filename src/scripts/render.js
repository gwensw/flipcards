// changes DOM elements, often in response to routing
import truncate from './truncate';
import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';
import editCardTemplate from '../templates/editCard.handlebars';
import newCardTemplate from '../templates/newCard.handlebars';

const main = document.querySelector('.main');
const header = document.querySelector('.header');

function growOnInput() {
  console.log('grow on input');
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
    main.innerHTML = newCardTemplate();
    const len = cards.length;
    for (let i = 0; i < len; i += 1) {
      this.newCard(i, cards[i].side1, cards[i].side2, cards[i].difficulty);
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
  newCard(index, side1, side2, difficulty) {
    const context = {
      index,
      side1,
      side2,
      difficulty
    };
    document.querySelector('.edit--new').insertAdjacentHTML('afterend', editCardTemplate(context));
    document.querySelector('.edit--new').firstElementChild.focus();
  },
  deletedCard(cardToDelete) {
    main.removeChild(cardToDelete);
  },
  clearValues(...elements) {
    elements.forEach((el) => {
      const element = el;
      element.value = '';
    });
  }
};

export default Render;
