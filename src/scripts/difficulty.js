import flashcards from 'flashcards';  // eslint-disable-line
import Render from './render';
import Play from './play';

let diffs;
let mindiff = 1;
let maxdiff = 5;
let lastnum = 1;
let totalCards = 0;

const Difficulty = {
  // render the selector modal and calculate cards of each difficulty
  init(name) {
    flashcards.openDeck(name);
    Render.diffselect(name, flashcards.getDisplayName(), flashcards.deckLength());
    const { cards } = flashcards.exposeDeck();
    diffs = [0, 0, 0, 0, 0];
    cards.forEach((card) => {
      const i = card.difficulty;
      diffs[i - 1] += 1;
    });
    totalCards = flashcards.deckLength();
  },
  update(num) {
    if (num === mindiff) {
      maxdiff = num;
    } else if (num === maxdiff) {
      mindiff = num;
    } else if (num < lastnum) {
      mindiff = num;
    } else if (num > lastnum) {
      maxdiff = num;
    } else if (num === lastnum) {
      mindiff = num;
      maxdiff = num;
    }
    lastnum = num;
    Render.selector(mindiff, maxdiff);
    // TODO: calculate how many cards fit between min and max diff
    totalCards = diffs.reduce((acc, val, index) => {
      if (index + 1 >= mindiff && index + 1 <= maxdiff) {
        return acc + val;
      }
      return acc;
    }, 0);
    // update button
    Render.selectorButton(totalCards);
  },
  confirm(name) {
    // TODO: diffselect confirmation should trigger Play.setup(name, minDiff, maxDiff, total)
    Play.setup(name, mindiff, maxdiff, totalCards);
  }
};

export default Difficulty;
