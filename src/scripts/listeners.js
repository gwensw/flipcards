import flashcards from 'flashcards';  // eslint-disable-line
import Edit from './edit';

const header = document.querySelector('.header');
const main = document.querySelector('.main');

const Listeners = {

  init() {
    // handle changes to deck display name
    header.addEventListener('change', (e) => {
      flashcards.setDisplayName(e.target.value);
      e.stopPropagation();
    });

    // allow enter key for input in header
    header.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.target.blur();
      }
    });

    // handle updates to cards in edit mode
    main.addEventListener('change', (e) => {
      Edit.cardtext(e);
    });

    // handles clicks - for card deletion or addition
    main.addEventListener('click', (e) => {
      const el = e.target;
      if (el.classList.contains('js-delete')) {
        Edit.deleteCard(el);
      } else if (el.classList.contains('js-add')) {
        Edit.addCard(el.parentNode.firstElementChild);
      }
    });

    // handle enter key presses
    main.addEventListener('keydown', (e) => {
      const el = e.target;
      if (e.keyCode === 13) {
        // allow creation of new cards via enter key press
        if (el.classList.contains('js-makenew')) {
          e.preventDefault();
          Edit.addCard(el.parentNode);
        }
      }
    });
  }

};

export default Listeners;
