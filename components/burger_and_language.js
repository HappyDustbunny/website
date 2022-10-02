$(function() {
  let toggleVar0 = 10; // Used to toggle border-radius for the burger menu
  let radius0 = 5; // Used to toggle border-radius for the burger menu
  let toggleVar1 = 10; // Used to toggle border-radius for the burger menu
  let radius1 = 5; // Used to toggle border-radius for the burger menu
  let ariaExpanded = false; // Used to toggle aria expandedness of burger-button

  let lang = ['en', 'da'];
  let language = 0; // English 0, Danish 1
  let languagePack = { // {'id': [['text', 'title'], ['tekst', 'titel']]} The variable language is 0 for english and 1 for danish
    'cookbook': [['Step-by-step cookbook', ''], ['Trin-for-trin kogebog', '']],
    'programming': [['Programming', ''], ['Programmering (Eng)', '']],
    'cooking': [['Cooking', ''], ['Madlavning', '']],
    'cookbooks': [['Cookbooks', ''], ['Kogebøger', '']],
    'baking': [['Baking', ''], ['Bagning', '']],
    'tempMix': [['37\u00B0 mixer', ''], ['37\u00B0 blander', '']],
    'home': [['Home', ''], ['Hjem', '']],
    'about': [['About', ''], ['Om', '']],
    // '': [['', ''], ['', '']],
  };

  if (localStorage.language) {
    language = localStorage.language;
  }

  // updateLanguage();
  setTimeout(updateLanguage, 300);

  $('.content').focus();

  // TODO: Make keyboard navigation for menu https://www.w3.org/WAI/GL/wiki/Using_ARIA_menus and https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
  // $(document).on('keydown', function(event) {
  //   console.log(event.which);
  // });

  $('.controlContainer').on('click', '.burgerControl', function(event) {
    event.preventDefault();
    $('.burgerItem').not('animated').slideToggle();
    $('.burgerHeading').not('animated').slideToggle();
    ariaExpanded = !ariaExpanded;
    $('.burgerControl').attr('aria-expanded', ariaExpanded);
  });

  // $('.controlContainer').on('click', '.languageDa', function(event) {
  $('.controlContainer').on('click', '.languageDa', function() {
    language = 1;
    localStorage.language = language;
    updateLanguage();
  });

  // $('.controlContainer').on('click', '.languageEng', function(event) {
  $('.controlContainer').on('click', '.languageEng', function() {
    language = 0;
    localStorage.language = language;
    updateLanguage();
  });

  $(document).on('keydown', function(event) { // English 0, Danish 1
    if (event.which === 68) { // 68 is the key d
      language = 1;
    } else if (event.which === 69) { // 69 is the key e
      language = 0;
    }
    localStorage.language = language;
    updateLanguage();
  });

  $('#FuzzyPlan').on('click', function() {
    window.location = 'https://madshorn.dk/planner/index.html';
  });

  $('#cookbook').on('click', function() {
    if (language) {
      window.location = 'https://kogebog.madshorn.dk/kogebog.html';
    } else {
      window.location = 'https://kogebog.madshorn.dk/kogebog.html'; // TODO: Translate kogebog.html
    }
  });

  $('#programming').on('click', function() {
    // $('#programming > *').not('animated').slideToggle();
    $('#programming').siblings().not('animated').slideToggle();
    toggleProgramming();
    if (toggleVar1 < 0) {
      $('#cooking').siblings().not('animated').slideToggle();
      toggleCooking()
    };
  });

  $('#journey').on('click', function() {
    window.location = 'https://madshorn.dk/programming/index.html';
  });

  $('#python').on('click', function() {
    window.location = 'https://madshorn.dk/programming/python.html';
  });

  $('#rust').on('click', function() {
    window.location = 'https://madshorn.dk/programming/rust.html';
  });

  $('#git').on('click', function() {
    window.location = 'https://madshorn.dk/programming/git.html';
  });

  $('#cmdline').on('click', function() {
    window.location = 'https://madshorn.dk/programming/cmdline.html';
  });

  $('#key').on('click', function() {
    window.location = 'https://madshorn.dk/programming/keymap.html';
  });

  $('#myGithub').on('click', function() {
    window.location = 'https://github.com/HappyDustbunny?tab=repositories';
  });

  $('#cooking').on('click', function() {
    $('#cooking').siblings().not('animated').slideToggle();
    toggleCooking();
    if (toggleVar0 < 0) {
      $('#programming').siblings().not('animated').slideToggle();
      toggleProgramming()
    };
  });

  $('#cookbooks').on('click', function() {
    window.location = '/cooking/cookbooks.html';
  });

  $('#baking').on('click', function() {
    window.location = 'https://madshorn.dk/baking/index.html';
  });
  $('#tempMix').on('click', function() {
    window.location = 'https://madshorn.dk/baking/tempmix/index.html';
  });

  function toggleProgramming() {
    radius0 = radius0 + toggleVar0;
    toggleVar0 = -toggleVar0;
    $('#programming').parent().css('border-radius', '15px 15px ' + radius0 + 'px ' + radius0 + 'px');
  }

  function toggleCooking() {
    radius1 = radius1 + toggleVar1;
    toggleVar1 = -toggleVar1;
    $('#cooking').parent().css('border-radius', '15px 15px ' + radius1 + 'px ' + radius1 + 'px');
  }

  $('#home').on('click', function() {
    window.location = 'https://madshorn.dk/index.html';
  });

  $('#about').on('click', function() {
    window.location = 'https://madshorn.dk/about/about.html';
  });

  $('img').on('dragstart', false);

  function updateLanguage() {
    let text = $('.burgerText');

    for (var index in text) {
      let id = text[index].id;
      if (languagePack[id]) {
        text[index].textContent = languagePack[id][language][0];
        text[index].title = languagePack[id][language][1];
        text[index].lang = lang[language]; // lang = ['en', 'da']
      }
    }

    if (language == 0) {
      $('.danish').hide()
      $('.english').show()
      $('.languageDa').css({ opacity: 0.3 });
      $('.languageEng').css({ opacity: 1 });
      $('.languageDa').attr('aria-pressed', 'false');
      $('.languageEng').attr('aria-pressed', 'true');
      $('.languageDa').removeClass('animateIt');
      $('.languageEng').addClass('animateIt');
    } else {
      $('.danish').show()
      $('.english').hide()
      $('.languageDa').css({ opacity: 1 });
      $('.languageEng').css({ opacity: 0.3 });
      $('.languageDa').attr('aria-pressed', 'true');
      $('.languageEng').attr('aria-pressed', 'false');
      $('.languageEng').removeClass('animateIt');
      $('.languageDa').addClass('animateIt');
    };
  }
});
