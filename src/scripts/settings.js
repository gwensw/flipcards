// default user settings for deck behaviour
const __defaultSettings = {
  qSide: 'side1',
  autocheck: true,
  firstanswer: true
};

// create empty deck settings object in local storage, if none exists
// & make sure any existing decks have user settings (backwards compatibility check)
function setupUserSettings(decks) {
  const usersettings = JSON.parse(localStorage.getItem('usersettings')) || {};
  for (let i = 0; i < decks.length; i += 1) {
    if (!usersettings[decks[i].name]) {
      usersettings[decks[i].name] = __defaultSettings;
    }
  }
  localStorage.setItem('usersettings', JSON.stringify(usersettings));
}
export default setupUserSettings;
