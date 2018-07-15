// returns star icons corresponding to difficulty

const handlebarsRuntime = require('handlebars/runtime');

function difficon(difficulty) {
  const fullStar = '<i class="fa fa-star" aria-hidden="true"></i>';
  const halfStar = '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
  const emptyStar = '<i class="fa fa-star-o" aria-hidden="true"></i>';
  const diff = parseInt(difficulty, 10);
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    if (diff >= i * 2 + 2) {
      stars.push(fullStar);
    } else if (diff >= i * 2 + 1) {
      stars.push(halfStar);
    } else {
      stars.push(emptyStar);
    }
  }
  return new handlebarsRuntime.SafeString(stars.join(''));
}

export default difficon;
