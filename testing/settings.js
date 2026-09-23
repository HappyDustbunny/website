
// window.addEventListener('storage', function(e) {
//   localStorage.setItem(e.key, e.newValue);
// });

document.getElementById('day').addEventListener('click', goBack);

document.getElementById('apply1').addEventListener('click', applyTaskDuration);

document.getElementById('apply2').addEventListener('click', applyToc);

document.getElementById('info').addEventListener('click', info);

document.getElementById('apply3').addEventListener('click', applyStressModel);

document.getElementById('goBack').addEventListener('click', goBack);

document.getElementById('inputBoxM').addEventListener('focus', inputBoxMGotFocus);

document.getElementById('inputBoxX').addEventListener('focus', inputBoxXGotFocus);
// document.getElementById('stressLevel').addEventListener('click', setStressLevel);
// document.getElementById('tDouble').addEventListener('click', setTDouble);


function info() {
  window.location.assign('instructions.html#stressModel');
}

function setUpFunc() {
  if (localStorage.defaultTaskDuration) {
    document.getElementById('inputBoxM').value = localStorage.defaultTaskDuration;
  }
  if (localStorage.ticInterval) {
    document.getElementById('inputBoxX').value = localStorage.ticInterval;
  }
  if (localStorage.radioButtonResultAlarm) {
    document.getElementById(localStorage.radioButtonResultAlarm).checked = 'checked';
  }
  if (localStorage.radioButtonResultReminder) {
    document.getElementById(localStorage.radioButtonResultReminder).checked = 'checked';
  }
  if (localStorage.wakeUpStress) {
    document.getElementById('stressLevel').value = localStorage.wakeUpStress;
  }
  if (localStorage.tDouble) {
    document.getElementById('tDouble').value = localStorage.tDouble;
  }
}

function inputBoxMGotFocus() {
  document.getElementById('inputBoxM').select();
}

function inputBoxXGotFocus() {
  document.getElementById('inputBoxX').select();
}

function applyTaskDuration() {

  let min = document.getElementById('inputBoxM').value.trim();

  if (isNaN(min) || min < 0 || 24*60 - 2 < min) { // TODO: Scroll to top or display message
    displayMessage('Use only numbers between 0 and 1438, please.', 3000);
    document.getElementById('inputBoxM').select();
    return;
  }

  localStorage.defaultTaskDuration = min;

  window.location.assign('main.html');
}


function applyToc() {
  let min = document.getElementById('inputBoxX').value.trim();

  if (isNaN(min) || min < 0 || 59 < min) {
    displayMessage('Use only numbers between 0 and 59, please.', 3000);
    document.getElementById('inputBoxX').select();
    return;
  }

  localStorage.ticInterval = min;

   let radioButtonResult1 = document.getElementsByClassName('alarm');
   for (var i = 0; i < 4; i++) {
     if (radioButtonResult1[i].type === 'radio' && radioButtonResult1[i].checked) {
       localStorage.radioButtonResultAlarm = radioButtonResult1[i].value;
     }
   }

   let radioButtonResult2 = document.getElementsByClassName('reminder');
   for (var i = 0; i < 3; i++) {
     if (radioButtonResult2[i].type === 'radio' && radioButtonResult2[i].checked) {
       localStorage.radioButtonResultReminder = radioButtonResult2[i].value;
     }
   }

   window.location.assign('main.html');
}


// function clearDay() {
//   let answer = confirm('Do you want to remove all tasks and start planning a new day?');
//   if (answer == true) {
//     localStorage.taskListAsText = [];
//     localStorage.wakeUpOrNowClickedOnce = false;
//     window.location.assign('main.html');
//   } else {
//     displayMessage('Nothing was changed', 3000);
//   }
// }


function goBack() {
  window.location.assign('main.html');
}

function displayMessage(text, displayTime) {
  console.log(text);
  msg = document.getElementById('message');
  msg.style.display = 'inline-block';
  msg.style.color = 'red';
  msg.textContent = text;

  setTimeout(function() {msg.style.display = 'none';}, displayTime)
}


function applyStressModel() {
  // Set wakeup stress level
  let value = document.getElementById('stressLevel').value.trim();
  if (isNaN(value) || value < 0 || 9 < value) {
    displayMessage('Use only numbers between 0 and 9, please', 3000);
    document.getElementById('stressLevel').select();
  } else {
    localStorage.wakeUpStress = value;
  }

  // Set tDouble
  let min = document.getElementById('tDouble').value.trim();
  if (isNaN(min) || min < 0 || 24*60 < min) {
    displayMessage('Use only numbers between 0 and 1438, please', 3000);
    document.getElementById('stressLevel').select();
  } else {
    localStorage.tDouble = min;
  }

  window.location.assign('main.html');
}
