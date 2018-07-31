// changes DOM elements, often in response to routing
import truncate from './truncate';
import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';
import editCardTemplate from '../templates/editCard.handlebars';
import newCardTemplate from '../templates/newCard.handlebars';
import trainingTemplate from '../templates/training.handlebars';
import questionTemplate from '../templates/question.handlebars';
import answerTemplate from '../templates/answer.handlebars';
import userControlsTemplate from '../templates/userControls.handlebars';

const main = document.querySelector('.main');
const header = document.querySelector('.header');

// make textarea grow on focus/input, and obey stylesheet otherwise
function addTextareaListeners() {
  function growOnInput() {
    const newHeight = Math.max(this.scrollHeight, this.offsetHeight);
    this.style.height = `${newHeight}px`;
  }
  function shrinkOnFocusout() {
    this.removeAttribute('style');
  }
  document.querySelectorAll('.edit__input').forEach((el) => {
    el.addEventListener('focus', growOnInput);
    el.addEventListener('input', growOnInput);
    el.addEventListener('focusout', shrinkOnFocusout);
  });
}

const Render = {
  header({
    backlink = false,
    deckTitle = '',
    name = false,
    inEditMode = false,
    inTrainingMode = false
  } = {}) {
    const context = {
      backlink,
      deckTitle,
      name,
      inEditMode,
      inTrainingMode
    };
    header.innerHTML = headerTemplate(context);
  },
  decks(decks) {
    const sortedDecks = decks.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
    sortedDecks.map((deck) => {
      deck.displayName = truncate(deck.displayName); // eslint-disable-line no-param-reassign
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
    addTextareaListeners();
  },
  updatedDiffColour(el, diffnum) {
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
    document.querySelector('.js-newside1').focus();
    addTextareaListeners();
  },
  deletedCard(cardToDelete) {
    main.removeChild(cardToDelete);
  },
  clearValues(...elements) {
    elements.forEach((el) => {
      const element = el;
      element.value = '';
    });
  },
  trainingView(autocheck = false) {
    main.innerHTML = trainingTemplate({ autocheck });
  },
  // render the question text on the card and insert appropriate user controls
  question(qText = '', diff, isFlipped = false) {
    const long = qText.length > 290;
    const card = document.getElementById('card');
    card.innerHTML = questionTemplate({
      qText,
      diff,
      isFlipped,
      long
    });
  },
  // render the answer text on the card and insert appropriate user controls
  answer(aText = '', isFlipped = false) {
    const long = aText.length > 290;
    const card = document.getElementById('card');
    card.innerHTML = answerTemplate({ aText, isFlipped, long });
  },
  controls({ isQuestion = true, autocheck = false } = {}) {
    // destroy the existing controls
    document.querySelectorAll('.js-control').forEach((el) => {
      el.remove();
    });
    // insert the new controls
    const card = document.getElementById('card');
    card.insertAdjacentHTML('afterend', userControlsTemplate({ isQuestion, autocheck }));
  },
  // renders updated user progress bar
  progress(sessionInfo, totalCards, numToRetry) {
    const bars = [];
    const cardsAnswered = sessionInfo.correct + sessionInfo.incorrect;
    const cardsRemaining = numToRetry ? numToRetry - cardsAnswered : totalCards - cardsAnswered;
    for (let i = 0; i < totalCards; i += 1) {
      if (sessionInfo.correctCards.includes(i)) {
        bars.push('correct');
      } else if (sessionInfo.incorrectCards.includes(i)) {
        bars.push('incorrect');
      }
    }
    for (let i = 0; i < cardsRemaining; i += 1) {
      bars.push('incomplete');
    }
    // TODO: insert progress bars template
    // document.querySelector('.progress').innerHTML = progressTemplate({ bars });
  }
};

export default Render;
