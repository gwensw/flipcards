import flashcards from 'flashcards';  // eslint-disable-line

const Edit = {
  cardtext(e) {
    const el = e.target;
    const parent = el.parentNode;
    if (el.classList.contains('side1') || el.classList.contains('side2')) {
      const side = el.classList.contains('side1') ? 'side1' : 'side2';
      const val = el.value.split('/').map(x => x.trim());
      flashcards.editCard(parent.dataset.index, side, val);
    } else if (el.classList.contains('diff')) {
      flashcards.editCard(parent.dataset.index, 'difficulty', parseInt(el.value, 10));
    }
  }
};

export default Edit;
