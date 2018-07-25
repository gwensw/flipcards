// default user settings for deck behaviour
const __defaultSettings = {
  qSide: 'side1',
  autocheck: true,
  firstanswer: true
};

const userSettings = {
  // create empty deck settings object in local storage, if none exists
  // & make sure any existing decks have user settings (backwards compatibility check)
  setup(decks) {
    const usersettings = JSON.parse(localStorage.getItem('usersettings')) || {};
    for (let i = 0; i < decks.length; i += 1) {
      if (!usersettings[decks[i].name]) {
        usersettings[decks[i].name] = __defaultSettings;
      }
    }
    localStorage.setItem('usersettings', JSON.stringify(usersettings));
  },
  // replace old deck settings with new deck settings
  update(name, deckSettings = __defaultSettings) {
    const oldSettings = JSON.parse(localStorage.getItem('usersettings'));
    oldSettings[name] = deckSettings;
    localStorage.setItem('usersettings', JSON.stringify(oldSettings));
  }
};

export default userSettings;
