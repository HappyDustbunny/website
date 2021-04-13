$(function() {
  let toggleVar0 = 10; // Used to toggle border-radius for the burger menu
  let radius0 = 5; // Used to toggle border-radius for the burger menu
  let toggleVar1 = 10; // Used to toggle border-radius for the burger menu
  let radius1 = 5; // Used to toggle border-radius for the burger menu

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
    $('#programming > *').not('animated').slideToggle();
    toggleProgramming();
    if (toggleVar1 < 0) {
      $('#cooking > *').not('animated').slideToggle();
      toggleCooking()
    };
    // window.location = '/programming/index.html';
  });

  $('#python').on('click', function() {
    window.location = '/programming/python.html';
  });

  $('#rust').on('click', function() {
    window.location = '/programming/rust.html';
  });

  $('#cooking').on('click', function() {
    $('#cooking > *').not('animated').slideToggle();
    toggleCooking();
    if (toggleVar0 < 0) {
      $('#programming > *').not('animated').slideToggle();
      toggleProgramming()
    };
    // window.location = '/cooking/index.html';
  });

  $('#cookbooks').on('click', function() {
    window.location = '/programming/cookbooks.html';
  });

  $('#baking').on('click', function() {
    window.location = '/programming/baking.html';
  });
  $('#tempMix').on('click', function() {
    window.location = '/programming/tempMix.html';
  });

  function toggleProgramming() {
    radius0 = radius0 + toggleVar0;
    toggleVar0 = -toggleVar0;
    $('#programming').css('border-radius', '15px 15px ' + radius0 + 'px ' + radius0 + 'px');
  }

  function toggleCooking() {
    radius1 = radius1 + toggleVar1;
    toggleVar1 = -toggleVar1;
    $('#cooking').css('border-radius', '15px 15px ' + radius1 + 'px ' + radius1 + 'px');
  }

  $('#about').on('click', function() { // TODO: Make about and om pages
    if (language) {
      window.location = '/about/om.html';
    } else {
      window.location = '/about/about.html';
    }
  });

  function changeLanguage() {
    let text = $('.burgerText');
    // let text = $('.burgerText').add('.burgerHeading');
    // TODO: Adding .add('burgerHeading') fix translation of multi-line burger-items, but overwrite the multi-lines :-(

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
