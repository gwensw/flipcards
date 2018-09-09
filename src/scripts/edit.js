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
    side1.value = '';
    side2.value = '';
    Render.newCard(newIndex, side1val, side2val, difficulty, separator);
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
  upload(file) {
    const newName = Math.floor(Date.now() / 1000).toString();
    const fr = new FileReader();
    fr.onload = (e) => {
      try {
        // Parse the file and build a new deck
        const newdeck = JSON.parse(e.target.result);
        flashcards.openDeck(newName);
        // give deck a display name
        flashcards.setDisplayName(newdeck.displayName);
        // add the cards to the deck
        const cards = newdeck.cards.map(card => Object.values(card));
        flashcards.addCards(...cards);
        // Save with default settings
        UserSettings.update(newName);
        // Render the new deck
        Render.decks(flashcards.listDecks());
        // render the success message
        Render.banner('success', `${newdeck.displayName} was successfully uploaded`, 4000);
      } catch (error) {
        // If error, delete the deck under construction & render error message
        flashcards.deleteDeck(newName);
        Render.banner(
          'error',
          'Upload failed! You must upload a correctly formatted JSON file. Download an existing deck for an example.',
          4000
        );
      }
    };
    fr.readAsText(file);
  }
};

export default Edit;
