$(function() {
  $('.opskrifter').hide();
  $('.ingredienser').hide();
  $('.howto').hide();
  // Repeted recipes are treated differently: they do not unfold until explicitly clicked
  $('.insertedIngredienser').hide();
  $('.insertedHowto').hide();
  // The a link is shown and the about button is hidden if no javascript is present
  $('#fallBackLink').hide();
  $('#about').show();
  $('#about').on('click', function() {
    window.location = 'index.html'
  });


  $('#foldOutFoldIn').on('click', function() {
    if ($(this)[0].value == 'unfold') {
      showIndex();
    } else if ($(this)[0].value == 'unfoldAll') {
      show();
    }
    else {
      hide();
    }

  });


  let direction = 1;
  let originalFontSize = parseInt($('body').css("font-size"));
  let fontSize = originalFontSize;
  let step = 5;
  $('#textSize').on('click', function() {  // Cycle between fontsizes normal-big-biggest-big-normal-big-...
    fontSize += direction * step;
    if (fontSize == originalFontSize + 2 * step) {
      direction = -1;
    } else if (fontSize == originalFontSize) {
      direction = 1;
    }
    $('body').css("font-size", fontSize);
  })

  $('p').on('click', function() {
    if ($(this).children()[0]) {
      $(this).children()[0].checked = !$(this).children()[0].checked;
    }
  });


  function hide() {
    $('.opskrifter').hide();
    $('.ingredienser').hide();
    $('.howto').hide();
    $('.insertedIngredienser').hide();
    $('.insertedHowto').hide();

    $('#foldOutFoldIn')[0].value = 'unfold';
    $('#foldOutFoldIn')[0].textContent = 'Fold index ud';
  }


  function showIndex() {
    $('.opskrifter').show();
    $('#foldOutFoldIn')[0].value = 'unfoldAll';
    $('#foldOutFoldIn')[0].textContent = 'Fold alt ud (for at kunne s\u00f8ge)';
  }


  function show() {
    $('.opskrifter').show();
    $('.ingredienser').show();
    $('.howto').show();

    $('#foldOutFoldIn')[0].value = 'fold';
    $('#foldOutFoldIn')[0].textContent = 'Fold alt ind';
  }

  // Fold everything
  $('.slut').on('click', function() {
    $('input').prop("checked", false);
    hide();
  });


  $('.oversigt').on('click', '.kategori', function(event) {
    event.preventDefault();
    $(this).next('.opskrifter').not('animated').slideToggle();
  });

  $('.opskrifter').on('click', '.recipe', function(event) {
    event.preventDefault();
    $(this).next('.ingredienser').not('animated').slideToggle();
    $(this).next('.ingredienser').next('.howto').not('animated').slideToggle();
  });

  // Repeted recipes are only unfolded when clicked explicitly
  $('.insertedRecipe').on('click', function(event) {
    event.preventDefault();
    $(this).next('.insertedIngredienser').not('animated').slideToggle();
    $(this).next('.insertedIngredienser').next('.insertedHowto').not('animated').slideToggle();
  });
})
