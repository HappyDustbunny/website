$(function() {
  let lang = ['en', 'da'];
  let language = 0; // English 0, Danish 1
  let languagePack = { // {'id': [['text', 'title'], ['tekst', 'titel']]} The variable language is 0 for english and 1 for danish
    'cookbook': [['Step-by-step cookbook', ''],
                 ['Trin-for-trin kogebog', '']],
    'programming': [['Programming', ''],
                    ['Programmering', '']],
    'cooking': [['Cooking', ''],
                ['Madlavning', '']],
    'about': [['About', ''],
              ['Om', '']],
    // '': [['', ''], ['', '']],
  };

  $('.languageDa').css({ opacity: 0.3 });
  changeLanguage();

  $('.controlContainer').on('click', '.burgerControl', function(event) {
    event.preventDefault();
    $('.burgerText').not('animated').slideToggle();
    $('.burgerHeading').not('animated').slideToggle();
    // $(this).siblings().children().not('animated').slideToggle();
  });
  $('.controlContainer').on('click', '.languageDa', function(event) {
    $('.languageDa').css({ opacity: 1 });
    $('.languageEng').css({ opacity: 0.3 });
    language = 1;
    changeLanguage();
  });

  $('.controlContainer').on('click', '.languageEng', function(event) {
    $('.languageDa').css({ opacity: 0.3 });
    $('.languageEng').css({ opacity: 1 });
    language = 0;
    changeLanguage();
  });

  $('#FuzzyPlan').on('click', function() {
    window.location = '/planner/main.html';
  });

  $('#cookbook').on('click', function() {
    if (language) {
      window.location = '/cooking/kogebog.html';
    } else {
      window.location = '/cooking/cookbook.html'; // TODO: Translate kogebog.html
    }
  });

  $('#programming').on('click', function() {
    $('.secondLevelBurgerText').not('animated').slideToggle();
    // window.location = '/programming/index.html';
  });

  $('#cooking').on('click', function() {
    window.location = '/cooking/index.html';
  });

  $('#about').on('click', function() { // TODO: Make about and om pages
    if (language) {
      window.location = '/about/om.html';
    } else {
      window.location = '/about/about.html';
    }
  });

  function changeLanguage() {
    let text = $('.burgerText')

    for (var index in text) {
      let id = text[index].id;
      if (languagePack[id]) {
        text[index].textContent = languagePack[id][language][0];
        text[index].title = languagePack[id][language][1];
        text[index].lang = lang[language]; // lang = ['en', 'da']
      }
    }
  }
});
