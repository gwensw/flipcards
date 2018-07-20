// returns selector with difficulty preselected

function diffselect(difficulty, options) {
  const repl = `value=${difficulty}`;
  return options.fn(this).replace(repl, `${repl} selected="selected"`);
}

export default diffselect;
