// create sample decks with some cards (if not already in localstorage)

import flashcards from 'flashcards'; // eslint-disable-line

function createSampleDecks() {
  if (!flashcards.listDecks().length) {
    flashcards.openDeck('100');
    flashcards.setDisplayName('food in Welsh');
    flashcards.addCards(
      ['milk', 'llaeth'],
      ['bread', 'bara'],
      ['soup', 'cawl'],
      ['butter', 'menyn'],
      ['cheese', 'caws'],
      ['tasty', 'blasus'],
      ['healthy', 'iachus'],
      ['chocolate', 'siocled'],
      ['carrots', 'moron'],
      ['beans', 'ffa'],
      ['toast', 'tost'],
      ['tomatoes', 'tomatos'],
      ['salt', 'halen'],
      ['salty', 'hallt'],
      ['pepper', ['pubr', 'pubur']],
      ['coffee', 'coffi']
    );
    flashcards.openDeck('300');
    flashcards.setDisplayName('AWS acronyms');
    flashcards.addCards(
      ['IAM', ['Identity and Access Management', 'Identity Access Management']],
      ['VPC', 'Virtual Private Cloud'],
      ['CloudHSM', ['Cloud Hardware Security Module', 'Hardware Security Module', 'CloudHardware Security Module']],
      ['WAF', 'Web Application Firewall'],
      ['EC2', 'Elastic Compute Cloud'],
      ['SWF', 'Simple Workflow Service'],
      ['EFS', 'Elastic File System'],
      ['S3', 'Simple Storage Service'],
      ['MQ', 'Message Queue'],
      ['RTOS', ['Real Time Operating System', 'Real-time Operating System']],
      ['EMR', ['Elastic MapReduce', 'Elastic Map Reduce']]
    );
    flashcards.openDeck('200');
    flashcards.setDisplayName('Very Long Deck Title Indeed');
    flashcards.openDeck('500');
    flashcards.setDisplayName('Colours of the Rainbow');
    flashcards.addCards(
      ['glas', 'blue'],
      ['coch', 'red'],
      ['melyn', 'yellow'],
      ['gwyrdd', 'green']
    );
    flashcards.openDeck('600');
  }
}

export default createSampleDecks;
