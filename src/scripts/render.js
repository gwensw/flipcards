// changes DOM elements, often in response to routing
import Chart from 'chart.js/dist/Chart.min';
import MicroModal from 'micromodal';
import truncate from './truncate';
import headerTemplate from '../templates/header.handlebars';
import decksTemplate from '../templates/decks.handlebars';
import editCardTemplate from '../templates/editCard.handlebars';
import newCardTemplate from '../templates/newCard.handlebars';
import diffselectTemplate from '../templates/diffselect.handlebars';
import diffselectButtonTemplate from '../templates/diffselectButton.handlebars';
import trainingTemplate from '../templates/training.handlebars';
import nextCardTemplate from '../templates/nextCard.handlebars';
import questionTemplate from '../templates/question.handlebars';
import answerTemplate from '../templates/answer.handlebars';
import userControlsTemplate from '../templates/userControls.handlebars';
import resultsTemplate from '../templates/results.handlebars';
import progressTemplate from '../templates/progress.handlebars';
import modalHeaderTemplate from '../templates/modalHeader.handlebars';
import settingsTemplate from '../templates/settings.handlebars';
import deletionConfirmationTemplate from '../templates/deletionConfirmation.handlebars';

const main = document.querySelector('.main');
const header = document.querySelector('.header');
const globalModal = document.querySelector('#globalModal .modal__overlay .modal__container');

// plugin for chart text adapted from http://jsfiddle.net/nkzyx50o/
Chart.pluginService.register({
  beforeDraw(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      const { ctx } = chart.chart;

      // Get options from the center object in options
      const fontSize = 16;
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'sans-serif';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

      // Start with a base font of 30px
      ctx.font = `lighter ${fontSize}px ${fontStyle}`;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(fontSize * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = `${fontSizeToUse}px ${fontStyle}`;
      ctx.fillStyle = color;

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});

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

// creates and returns a donut chart inside the specified element
function makeNewChart(correct, incorrect, centertext, id) {
  const donutChart = new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [correct, incorrect],
        backgroundColor: ['#FFAA39', '#C9C9C9']
      }],
      labels: ['Correct', 'Incorrect']
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        center: {
          text: centertext,
          color: '#4A4A4A',
          fontStyle: 'Open Sans',
          sidePadding: 50
        },
        arc: {
          borderWidth: 5,
        }
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: '#fff',
        bodyFontFamily: 'Open Sans, sans-serif',
        bodyFontColor: '#4A4A4A',
        yPadding: 9
      },
      animation: {
        duration: 600,
        animateScale: true
      },
      cutoutPercentage: 68
    }
  });
  return donutChart;
}

// build and reveal a modal with header
function createModal(displayName, redirect, contents) {
  // build the modal header
  const context = { displayName };
  globalModal.innerHTML = '';
  globalModal.insertAdjacentHTML('afterBegin', modalHeaderTemplate(context));
  // add the modal contents
  globalModal.insertAdjacentHTML('beforeEnd', contents);
  // reveal the modal
  MicroModal.show('globalModal', {
    // when closing the modal, redirect to edit page - allows use of back button to close
    onClose() { window.location.hash = redirect; }
  });
}

function forceHideModal() {
  document.getElementById('globalModal').classList.remove('is-open');
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
    // hide modal if necessary
    forceHideModal();
  },
  editView(cards) {
    main.innerHTML = newCardTemplate();
    const len = cards.length;
    for (let i = 0; i < len; i += 1) {
      this.newCard(i, cards[i].side1, cards[i].side2, cards[i].difficulty);
    }
    addTextareaListeners();
    // hide settings modal if necessary
    forceHideModal();
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
    document
      .querySelector('.edit--new')
      .insertAdjacentHTML('afterend', editCardTemplate(context));
    document
      .querySelector('.js-newside1')
      .focus();
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
  diffselect(name, displayName, totalCards) {
    // build and reveal the modal
    createModal(displayName, '/', diffselectTemplate({ name }));
    // create the button
    this.selectorButton(totalCards);
  },
  // updates the size of the difficulty selector
  selector(min, max) {
    const selector = document.querySelector('.diffselector__frame');
    selector.style.gridColumnStart = min;
    selector.style.gridColumnEnd = max + 1;
  },
  selectorButton(totalCards) {
    const selectorButton = document.getElementById('selectorButton');
    selectorButton.innerHTML = diffselectButtonTemplate({ totalCards });
  },
  trainingView(autocheck = false) {
    main.innerHTML = trainingTemplate({ autocheck });
    forceHideModal();
  },
  nextCard(qText, diff) {
    // TODO: remove (and animate removal of) the old card
    // TODO: create a new card and animate its appearance
    document
      .querySelector('#card')
      .innerHTML = nextCardTemplate();
    // Render question text on the new card
    this.question(qText, diff);
    // TODO: animate card changeover
  },
  // render the question text on the card and insert appropriate user controls
  question(qText = '', diff) {
    const long = qText.length > 290;
    // add text to card
    document
      .getElementById('question')
      .innerHTML = questionTemplate({ qText, long, diff });
    // animate card flip
    document
      .querySelector('.card__flipbox')
      .classList
      .remove('card__flipbox--flip');
  },
  // render the answer text on the card and insert appropriate user controls
  answer(aText = '', diff) {
    const long = aText.length > 290;
    // add text to card
    document
      .getElementById('answer')
      .innerHTML = answerTemplate({ aText, long, diff });
    // animate card flip
    document
      .querySelector('.card__flipbox')
      .classList
      .add('card__flipbox--flip');
  },
  controls({
    isQuestion = true,
    isResults = false,
    autocheck = false,
    retry = false
  } = {}) {
    // destroy the existing controls
    document
      .querySelectorAll('.js-control')
      .forEach((el) => {
        el.remove();
      });
    // insert the new controls
    const selector = isResults ? '.results__chart' : '.card';
    document
      .querySelector(selector)
      .insertAdjacentHTML('afterend', userControlsTemplate({
        isQuestion,
        isResults,
        autocheck,
        retry
      }));
  },
  // renders updated user progress bar
  progress(sessionInfo, totalCards, numToRetry, deckLength) {
    // build progress blocks
    const bars = [];
    const cardsAnswered = sessionInfo.correct + sessionInfo.incorrect;
    const cardsRemaining = numToRetry ? numToRetry - cardsAnswered : totalCards - cardsAnswered;
    for (let i = 0; i < deckLength; i += 1) {
      if (sessionInfo.correctCards.includes(i)) {
        bars.push({ result: 'correct', correct: true });
      } else if (sessionInfo.incorrectCards.includes(i)) {
        bars.push({ result: 'incorrect', incorrect: true });
      }
    }
    for (let i = 0; i < cardsRemaining; i += 1) {
      bars.push({ result: 'incomplete' });
    }
    console.log('answered', cardsAnswered, 'remaining', cardsRemaining, 'total', totalCards);
    // insert progress bar template
    document.querySelector('.progress').innerHTML = progressTemplate({ bars });
  },
  results(correct, incorrect) {
    // delete the card
    const card = document.getElementById('card');
    card.parentNode.removeChild(card);

    // render the results text and space for chart
    const total = incorrect + correct;
    const percent = correct / total;
    let message = 'Perfect score!';
    if (percent < 1) {
      message = 'Good job!';
    }
    if (percent < 0.6) {
      message = 'Not too bad';
    }
    if (percent < 0.4) {
      message = 'Keep practicing!';
    }
    const context = {
      message,
      correct,
      total
    };
    document
      .querySelector('.progress')
      .insertAdjacentHTML('afterend', resultsTemplate(context));

    // render the donut chart
    makeNewChart(correct, incorrect, `${correct} / ${total}`, 'endchart');
  },
  settings(name, displayName) {
    // build the modal contents
    const contents = settingsTemplate();
    // build and reveal the modal
    createModal(displayName, `edit/${name}`, contents);
  },
  // renders a confirmation dialog inside the settings modal
  deletionConfirmation(displayName) {
    // get rid of the settings elements
    const settings = document.querySelector('.settings');
    settings.parentElement.removeChild(settings);
    // show the confirmation message inside the modal
    globalModal.insertAdjacentHTML('beforeEnd', deletionConfirmationTemplate({ displayName }));
  }
};

export default Render;
