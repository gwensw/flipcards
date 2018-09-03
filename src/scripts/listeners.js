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

    // handle changes, including updates to cards in edit mode
    main.addEventListener('change', (e) => {
      const el = e.target;
      if (el.id === 'upload') {
        const { files } = el;
        if (files.length) {
          Edit.upload(files.item(0));
        }
      } else {
        Edit.cardtext(e);
      }
    });

    // handles clicks on main - for editing and training
    main.addEventListener('click', (e) => {
      const el = e.target;
      if (el.classList.contains('js-delete')) {
        Edit.deleteCard(el);
      } else if (el.classList.contains('js-add')) {
        Edit.addCard(el.parentNode.firstElementChild);
      } else if (el.id === 'show' || el.closest('#questionside')) {
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
      } else if (el.id === 'check') {
        // submit the user's attempt for marking
        const useranswer = document.getElementById('useranswer').value;
        Play.processAnswer(useranswer);
      } else if (el.id === 'next') {
        Play.drawNextCard();
      }
    });

    // handle enter key presses
    main.addEventListener('keydown', (e) => {
      const el = e.target;
      if (e.keyCode === 13) {
        if (el.classList.contains('js-makenew')) {
          // allow creation of new cards via enter key press
          e.preventDefault();
          Edit.addCard(el.parentNode);
        } else if (el.id === 'useranswer') {
          // allow user to submit answer via enter key press
          e.preventDefault();
          Play.processAnswer(el.value);
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
        Edit.deleteDeck(false);
      } else if (el.id === 'confirmDelete') {
        Edit.deleteDeck(true);
      } else if (el.id === 'cancelDelete') {
        // trick router into reloading settings
        const oldhash = window.location.hash;
        window.location.hash = oldhash.replace('/settings', '');
        window.location.hash = oldhash;
      } else if (el.id === 'downloadDeck') {
        Edit.download();
      }
    });

    // change settings in modal
    globalModal.addEventListener('change', (e) => {
      const el = e.target;
      const name = document.querySelector('.settings').dataset.deck;
      const us = UserSettings.get(name);
      if (el.name === 'align') {
        us.leftalign = el.value === 'left';
      } else if (el.name === 'side') {
        us.qSide = el.value;
      } else if (el.name === 'autocheck') {
        us.autocheck = el.checked;
      } else if (el.name === 'separator') {
        us.separator = el.value.trim();
      }
      UserSettings.update(name, us);
    });
  }

};

export default Listeners;
