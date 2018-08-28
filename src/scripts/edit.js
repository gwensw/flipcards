import flashcards from 'flashcards';  // eslint-disable-line
import Render from './render';

const Edit = {
  cardtext(e) {
    debugger; // eslint-disable-line
    const el = e.target;
    const parent = el.parentNode;
    if (el.classList.contains('js-side1') || el.classList.contains('js-side2')) {
      const side = el.classList.contains('js-side1') ? 'side1' : 'side2';
      const val = el.value.split('/').map(x => x.trim());
      flashcards.editCard(parent.parentNode.dataset.index, side, val);
    } else if (el.classList.contains('js-setdiff')) {
      const newDiff = parseInt(el.value, 10);
      flashcards.editCard(parent.dataset.index, 'difficulty', newDiff);
      Render.updatedDiffColour(el, newDiff);
    }
  },
  addCard(el) {
    const side1 = el.firstElementChild;
    const side2 = side1.nextElementSibling;
    const difficulty = 3;
    flashcards.addCard(side1.value, side2.value, difficulty);
    const newIndex = flashcards.deckLength() - 1;
    Render.newCard(newIndex, side1.value, side2.value, difficulty);
    Render.clearValues(side1, side2);
  },
  deleteCard(el) {
    const cardToDelete = el.parentNode;
    const indexToDelete = cardToDelete.dataset.index;
    flashcards.deleteCard(indexToDelete);
    Render.deletedCard(cardToDelete);
    // reset the card indexes
    Array
      .from(document.querySelectorAll('.js-cardedit'))
      .forEach((c) => {
        if (c.dataset.index > indexToDelete) {
          c.dataset.index -= 1; // eslint-disable-line no-param-reassign
        }
      });
  },
  deleteDeck(name = false) {
    if (name) {
      // send user back to main screen
      window.location = '';
      window.location.hash = '#/';
      // delete the deck for real
      flashcards.deleteDeck(name);
      // TODO: render a temporary undo dialog on the main screen
    } else {
      // render the confirmation screen
      Render.deletionConfirmation(flashcards.getDisplayName());
    }
  }
};

export default Edit;
