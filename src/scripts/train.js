// // autosaves progress and triggers progress bar render

// function recordProgress () {
//   const sessioninfo = flashcards.getSessionInfo();
//   const name = flashcards.exposeDeck().name;
//   let usersettings = getUserSettings(name);
//   usersettings.state = sessioninfo;
//   updateUserSettings(name, usersettings);
//   Render.progress(sessioninfo, flashcards.deckLength());
// }

// function drawNextCard () {
//   recordProgress();
//   let card = numToRetry ? flashcards.draw(cardsToRetry.splice(0, 1)[0]) : flashcards.drawNext();
//   if (!card) {
//     Render.score(flashcards.getSessionInfo());
//   } else {
//     Render.question(card.question[0], card.difficulty);
//     document.querySelector('.answer__input').addEventListener('keydown', enterAnswer);
//     document.querySelector('#card').removeEventListener('click', drawNextCard);
//     document.querySelector('#card').addEventListener('click', submitAnswer);
//   }
// }
