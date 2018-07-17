// returns chart showing average difficulty

const handlebarsRuntime = require('handlebars/runtime');

function avgchart(difficulty) {
  const diff = parseInt(difficulty, 10);
  const bar = '<div class="avgchart__bar"></div>';
  const tallbar = `<div class="avgchart__bar avgchart__bar--tall"><p class="avgchart__num">${diff}</p></div>`;
  const chart = [];
  for (let i = 1; i <= 5; i += 1) {
    if (i === diff) {
      chart.push(tallbar);
    } else {
      chart.push(bar);
    }
  }
  return new handlebarsRuntime.SafeString(chart.join(''));
}

export default avgchart;
