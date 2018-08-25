import Render from './render';

let mindiff = 1;
let maxdiff = 5;
let lastnum = 1;

const Difficulty = {
  update(num) {
    if (num < lastnum) {
      mindiff = num;
    } else if (num > lastnum) {
      maxdiff = num;
    } else if (num === lastnum) {
      mindiff = num;
      maxdiff = num;
    }
    lastnum = num;
    Render.selector(mindiff, maxdiff);
    // TODO: update button - use a listener to change the button number and apply a class 'disable' if necessary
  },
  confirm(name) {
    // route to training view
    // window.location.href = `#/train/${name}/${mindiff}/${maxdiff}`;
    console.log('confirmed');
};

export default Difficulty;
