// $(function() {
  // let toggleVar0 = 10; // Used to toggle border-radius for the burger menu
  // let radius0 = 5; // Used to toggle border-radius for the burger menu
  // let toggleVar1 = 10; // Used to toggle border-radius for the burger menu
  // let radius1 = 5; // Used to toggle border-radius for the burger menu
  // let toggleVar2 = 10; // Used to toggle border-radius for the burger menu
  // let radius2 = 5; // Used to toggle border-radius for the burger menu
  // let ariaExpanded = false; // Used to toggle aria expandedness of burger-button

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

  // $('.controlContainer').on('click', '.burgerControl', function(event) {
  //   event.preventDefault();
  //   $('.burgerItem').not('animated').slideToggle();
  //   $('.burgerHeading').not('animated').slideToggle();
  //   ariaExpanded = !ariaExpanded;
  //   $('.burgerControl').attr('aria-expanded', ariaExpanded);
  // });

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

  // $('.controlContainer').on('click', '#languageDa', function() {
  //   language = 1;
  //   localStorage.language = language;
  //   updateLanguage();
  // });

  // $('.controlContainer').on('click', '#languageEng', function() {
  //   language = 0;
  //   localStorage.language = language;
  //   updateLanguage();
  // });
  document.addEventListener('keypress', function(event) { // English 0, Danish 1
    if (event.key === 'd') { // 68 is the key d
      language = 1;
    } else if (event.key === 'e') { // 69 is the key e
      language = 0;
    }
    localStorage.language = language;
    updateLanguage();
  });

  // $(document).on('keydown', function(event) { // English 0, Danish 1
  //   if (event.which === 68) { // 68 is the key d
  //     language = 1;
  //   } else if (event.which === 69) { // 69 is the key e
  //     language = 0;
  //   }
  //   localStorage.language = language;
  //   updateLanguage();
  // });

  // $('#FuzzyPlan').on('click', function() {
  //   window.location = 'https://madshorn.dk/planner/index.html';
  // });

  // $('#cookbook').on('click', function() {
  //   if (language) {
  //     window.location = 'https://kogebog.madshorn.dk/kogebog.html';
  //   } else {
  //     window.location = 'https://cookbook.madshorn.dk/cookbook.html';
  //   }
  // });

  // $('#programming').on('click', function() {
  //   // $('#programming > *').not('animated').slideToggle();
  //   $('#programming').siblings().not('animated').slideToggle();
  //   toggleProgramming();
  //   if (toggleVar1 < 0) {
  //     $('#cooking').siblings().not('animated').slideToggle();
  //     $('#psychEd').siblings().not('animated').slideToggle();
  //     toggleCooking();
  //     togglepsychEd();
  //   };
  // });

  // $('#journey').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/index.html';
  // });

  // $('#python').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/python.html';
  // });

  // $('#rust').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/rust.html';
  // });

  // $('#git').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/git.html';
  // });

  // $('#cmdline').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/cmdline.html';
  // });

  // $('#vscode').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/vscode.html';
  // });

  // $('#key').on('click', function() {
  //   window.location = 'https://madshorn.dk/programming/keymap.html';
  // });

  // $('#myGithub').on('click', function() {
  //   window.location = 'https://github.com/HappyDustbunny?tab=repositories';
  // });

  // $('#cooking').on('click', function() {
  //   $('#cooking').siblings().not('animated').slideToggle();
  //   toggleCooking();
  //   if (toggleVar0 < 0) {
  //     $('#programming').siblings().not('animated').slideToggle();
  //     $('#psychEd').siblings().not('animated').slideToggle();
  //     toggleProgramming();
  //     togglepsychEd();
  //   };
  // });

  // $('#cookbooks').on('click', function() {
  //   window.location = 'https://madshorn.dk/cooking/cookbooks.html';
  // });

  // $('#baking').on('click', function() {
  //   window.location = 'https://madshorn.dk/baking/index.html';
  // });
  // $('#tempMix').on('click', function() {
  //   window.location = 'https://madshorn.dk/baking/tempmix/index.html';
  // });


  // $('#psychEd').on('click', function() {
  //   $('#psychEd').siblings().not('animated').slideToggle();
  //   togglepsychEd();
  //   if (toggleVar0 < 0) {
  //     $('#programming').siblings().not('animated').slideToggle();
  //     $('#cooking').siblings().not('animated').slideToggle();
  //     toggleProgramming();
  //     toggleCooking();
  //   };
  // });

  // $('#dementia').on('click', function() {
  //   window.location = '/psychEd/dementia.html';
  // });

  // $('#autismADHD').on('click', function() {
  //   window.location = '/psychEd/autismADHD.html';
  // });

  // function toggleProgramming() {
  //   radius0 = radius0 + toggleVar0;
  //   toggleVar0 = -toggleVar0;
  //   $('#programming').parent().css('border-radius', '15px 15px ' + radius0 + 'px ' + radius0 + 'px');
  // }

  // function toggleCooking() {
  //   radius1 = radius1 + toggleVar1;
  //   toggleVar1 = -toggleVar1;
  //   $('#cooking').parent().css('border-radius', '15px 15px ' + radius1 + 'px ' + radius1 + 'px');
  // }

  // function togglepsychEd() {
  //   radius2 = radius2 + toggleVar1;
  //   toggleVar1 = -toggleVar1;
  //   $('#psychEd').parent().css('border-radius', '15px 15px ' + radius2 + 'px ' + radius2 + 'px');
  // }

  // $('#home').on('click', function() {
  //   window.location = 'https://madshorn.dk/index.html';
  // });

  // $('#about').on('click', function() {
  //   window.location = 'https://madshorn.dk/about/about.html';
  // });

  $('img').on('dragstart', false);

  function updateLanguage() {
    // let text = $('.burgerText');
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
        // $('#languageReminder').hide()
      }
    }

    let danishDOMList = document.getElementsByClassName('danish');
    let englishDomList = document.getElementsByClassName('english');
    if (language == 0) {
      [...danishDOMList].forEach( item => item.hidden = true);
      [...englishDomList].forEach( item => item.hidden = false); 
      // $('.danish').hide()
      // $('.english').show()
      // $('#languageDa').css({ opacity: 0.3 });
      // $('#languageEng').css({ opacity: 1 });
      document.getElementById('languageDa').classList.add('animateIt');
      document.getElementById('languageEng').classList.remove('animateIt');
      // $('#languageDa').removeClass('animateIt');
      // $('#languageEng').addClass('animateIt');
    } else {
      [...danishDOMList].forEach( item => item.hidden = false);
      [...englishDomList].forEach( item => item.hidden = true); 
      // document.getElementById('danish').show();
      // document.getElementById('english').hide();
      // $('.danish').show()
      // $('.english').hide()
      // $('#languageDa').css({ opacity: 1 });
      // $('#languageEng').css({ opacity: 0.3 });
      document.getElementById('languageDa').classList.remove('animateIt');
      document.getElementById('languageEng').classList.add('animateIt');
      // $('#languageEng').removeClass('animateIt');
      // $('#languageDa').addClass('animateIt');
    };
  }
// });
