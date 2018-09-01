import flashcards from 'flashcards';  // eslint-disable-line
import Render from './render';
import UserSettings from './settings';

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
    const { separator } = UserSettings.get(flashcards.exposeDeck().name);
    const side1val = side1.value.split(separator).map(x => x.trim());
    const side2val = side2.value.split(separator).map(x => x.trim());
    const difficulty = 3;
    flashcards.addCard(
      side1val,
      side2val,
      difficulty
    );
    const newIndex = flashcards.deckLength() - 1;
    Render.newCard(newIndex, side1val, side2val, difficulty, separator);
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
  deleteDeck(confirmed = false) {
    if (confirmed) {
      // send user back to main screen
      window.location = '';
      window.location.hash = '#/';
      // delete the deck for real
      flashcards.deleteDeck(flashcards.exposeDeck().name);
      // TODO: render a temporary undo dialog on the main screen
    } else {
      // render the confirmation screen
      Render.deletionConfirmation(flashcards.getDisplayName());
    }
  },
  // download a deck as JSON
  download() {
    const deck = flashcards.exposeDeck();
    const filename = deck.displayName.replace(/ /g, '-');
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(deck))}`;
    const tempAnchor = document.createElement('a');
    tempAnchor.setAttribute('href', dataString);
    tempAnchor.setAttribute('download', `${filename}.json`);
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    tempAnchor.remove();
  },
  // upload a JSON to create a new deck
  upload() {
    console.log('upload here');
  }
};

export default Edit;
