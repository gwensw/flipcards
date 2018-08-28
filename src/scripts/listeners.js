import flashcards from 'flashcards';  // eslint-disable-line
import Edit from './edit';
import Play from './play';
import Difficulty from './difficulty';
import UserSettings from './settings';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const globalModal = document.getElementById('globalModal');

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

    // handles clicks on main - for editing and training
    main.addEventListener('click', (e) => {
      const el = e.target;
      if (el.classList.contains('js-delete')) {
        Edit.deleteCard(el);
      } else if (el.classList.contains('js-add')) {
        Edit.addCard(el.parentNode.firstElementChild);
      } else if (el.id === 'show' || el.closest('#questionside')) {
        // reveal answer side when user taps card or 'show' button
        Play.showAnswer();
      } else if (el.closest('#answerside')) {
        // show question again when user taps card
        document.querySelector('.card__flipbox').classList.remove('card__flipbox--flip');
        Play.showQuestion();
      } else if (el.closest('#correct') || el.closest('#incorrect')) {
        // score and proceed to the next card once user has marked themselves
        const outcome = el.closest('#correct') ? 'correct' : 'incorrect';
        Play.processResult(outcome);
      } else if (el.id === 'shuffle') {
        Play.shuffle();
        Difficulty.init(flashcards.exposeDeck().name);
      } else if (el.id === 'retry') {
        Play.retry();
      } else if (el.id === 'end') {
        Play.reset();
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

    // handle selections in modals
    globalModal.addEventListener('click', (e) => {
      const el = e.target;
      if (el.dataset.diffnum) {
        Difficulty.update(parseInt(el.dataset.diffnum, 10));
      } else if (el.id === 'confirmDifficulty') {
        Difficulty.confirm(el.parentElement.dataset.name);
      } else if (el.id === 'deleteDeck') {
        // render the confirmation screen
        Edit.deleteDeck();
      } else if (el.id === 'confirmDelete') {
        const name = document.querySelector('.settings').dataset.deck;
        Edit.deleteDeck(name);
      } else if (el.id === 'cancelDelete') {
        // trick router into reloading settings
        const oldhash = window.location.hash;
        window.location.hash = oldhash.replace('/settings', '');
        window.location.hash = oldhash;
      }
    });

    // change settings in modal
    globalModal.addEventListener('change', (e) => {
      const el = e.target;
      const name = document.querySelector('.settings').dataset.deck;
      const us = UserSettings.get(name);
      if (el.name === 'align') {
        us.leftalign = el.value === 'left';
        UserSettings.update(name, us);
      }
    });
  }

};

export default Listeners;
