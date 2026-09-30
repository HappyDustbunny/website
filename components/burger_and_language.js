let lang = ['en', 'da'];
let language = 0; // English 0, Danish 1
let languagePack = { // {'id': [['text', 'title'], ['tekst', 'titel']]} The variable language is 0 for english and 1 for danish
  'cookbook': [['Step-by-step cookbook', 'https://cookbook.madshorn.dk/cookbook.html'], ['Trin-for-trin kogebog', 'https://kogebog.madshorn.dk/kogebog.html']],
  'programming': [['Programming', ''], ['Programmering (Eng)', '']],
  'cooking': [['Cooking', ''], ['Madlavning', '']],
  'cookbooks': [['Cookbooks', ''], ['Kogebøger', '']],
  'baking': [['Baking', ''], ['Bagning', '']],
  'tempMix': [['37\u00B0 mixer', ''], ['37\u00B0 blander', '']],
  'psychEd': [['Psychoeducation', ''], ['Selvforståelse', '']],
  'dementia': [['Dementia', ''], ['Demens', '']],
  'autismADHD': [['Autism and ADHD', ''], ['Autisme og ADHD', '']],
  'home': [['Home', ''], ['Hjem', '']],
  'about': [['About', ''], ['Om', '']],
  // '': [['', ''], ['', '']],
};

if (localStorage.language) {
  language = localStorage.language;
}

// updateLanguage();
setTimeout(updateLanguage, 300);

// $('.content').focus();

document.getElementById('languageDa').addEventListener('click', function() {
  language = 1;
  localStorage.language = language;
  updateLanguage();
});

document.getElementById('languageEng').addEventListener('click', function() {
  language = 0;
  localStorage.language = language;
  updateLanguage();
});

document.addEventListener('keypress', function(event) { // English 0, Danish 1
  if (event.key === 'd') { // 68 is the key d
    language = 1;
  } else if (event.key === 'e') { // 69 is the key e
    language = 0;
  }
  localStorage.language = language;
  updateLanguage();
});

// $('img').on('dragstart', false);

function updateLanguage() {
  let text = document.getElementsByClassName('burgerText');

  text[1].href = languagePack['cookbook'][language][1]; // Change href target for Cookbook

  for (var index in text) {
    let id = text[index].id;
    if (languagePack[id]) {
      text[index].textContent = languagePack[id][language][0];
      text[index].title = languagePack[id][language][1];
      text[index].lang = lang[language]; // lang = ['en', 'da']
      text[index].ariaLabel = languagePack[id][language][0];
    }
    if(localStorage.language) {
      document.getElementById('languageReminder').hidden = true;
    }
  }

  let danishDOMList = document.getElementsByClassName('danish');
  let englishDomList = document.getElementsByClassName('english');
  if (language == 0) {
    [...danishDOMList].forEach( item => item.hidden = true);
    [...englishDomList].forEach( item => item.hidden = false); 
    document.getElementById('languageDa').classList.add('animateIt');
    document.getElementById('languageEng').classList.remove('animateIt');
  } else {
    [...danishDOMList].forEach( item => item.hidden = false);
    [...englishDomList].forEach( item => item.hidden = true); 
    document.getElementById('languageDa').classList.remove('animateIt');
    document.getElementById('languageEng').classList.add('animateIt');
  };

  changeTitle();
}
