let defaultTaskDuration = 30;

let taskText = '';
let taskDuration = defaultTaskDuration;
let taskTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 00);
let drainGainLevel = 1;


document.getElementById('inputTaskBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readTaskText(); } });
document.getElementById('inputDurationBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readDurationTime(); } });
document.getElementById('inputTimeBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readTaskStartTime(); } });
// document.getElementById('inputTimeBox').addEventListener('keypress', function () { inputAtEnterTime(event); });


document.getElementById('durationPlus1h').addEventListener('click', function() {changeDuration(60);});
document.getElementById('durationPlus30m').addEventListener('click', function() {changeDuration(30);});
document.getElementById('durationPlus15m').addEventListener('click', function() {changeDuration(15);});
document.getElementById('durationPlus5m').addEventListener('click', function() {changeDuration(5);});

document.getElementById('durationMinus1h').addEventListener('click', function() {changeDuration(-60);});
document.getElementById('durationMinus30m').addEventListener('click', function() {changeDuration(-30);});
document.getElementById('durationMinus15m').addEventListener('click', function() {changeDuration(-15);});
document.getElementById('durationMinus5m').addEventListener('click', function() {changeDuration(-5);});

document.getElementById('timePlus1h').addEventListener('click', function() {changeTime(60);});
document.getElementById('timePlus30m').addEventListener('click', function() {changeTime(30);});
document.getElementById('timePlus15m').addEventListener('click', function() {changeTime(15);});
document.getElementById('timePlus5m').addEventListener('click', function() {changeTime(5);});

document.getElementById('timeMinus1h').addEventListener('click', function() {changeTime(-60);});
document.getElementById('timeMinus30m').addEventListener('click', function() {changeTime(-30);});
document.getElementById('timeMinus15m').addEventListener('click', function() {changeTime(-15);});
document.getElementById('timeMinus5m').addEventListener('click', function() {changeTime(-5);});

document.getElementById('clear').addEventListener('click', clearTimeBox);
document.getElementById('now').addEventListener('click', setTimeNow);

document.getElementById('info').addEventListener('click', function() {goToPage('instructions.html#stressModel');});

document.getElementById('cancel').addEventListener('click', justReturn);
document.getElementById('apply').addEventListener('click', function() {readTaskText(); returnTask();});


function setUpFunc() {
  document.getElementById('d1').checked = 'checked';
  document.getElementById('apply').textContent = 'Ok (then tap where this task should be)';

  fillDurationBox(defaultTaskDuration);

  manageLocallyStoredStuff();

  clearTimeBox();

  let inputBox = document.getElementById('inputTaskBox');
  if (inputBox.value === '') {
    inputBox.focus();
  } else {
    inputBox.blur();
  }
}

function manageLocallyStoredStuff() {
  if (localStorage.getItem('defaultTaskDuration')) {
    defaultTaskDuration = localStorage.defaultTaskDuration;
  }
  if (localStorage.getItem('inputBoxContent')) {
    parseCurrentTask(localStorage.inputBoxContent);
  }
  if (localStorage.getItem('newTaskText')) {
      localStorage.removeItem('newTaskText');
  }
}


function changeDuration(minutes) {
  taskDuration += minutes;
  fillDurationBox(taskDuration);
}


function fillDurationBox(duration) {
  let hours = 0;
  let minutes = 0;

  hours = (duration - (duration % 60)) / 60;
  minutes = duration - hours * 60;

  let formattedDuration = hours + 'h' + minutes + 'm';

  document.getElementById('inputDurationBox').value = formattedDuration;
}


function changeTime(minutes) {
  taskTime = new Date(taskTime.getTime() + minutes * 60000);
  fillTimeBox(taskTime);
}


function fillTimeBox(time) {
  prettyTaskTime = prettifyTime(time);

  document.getElementById('inputTimeBox').value = prettyTaskTime;

  document.getElementById('apply').textContent = 'Ok'; // Remove instruction from return-button as the task will be added the right place automatically
}


function prettifyTime(time) {
  taskTimeHours = time.getHours().toString();
  taskTimeMinutes = time.getMinutes().toString();

  // Check if leading zeroes are needed and add them
  let nils = ['', ''];
  if (taskTimeHours < 10) {
    nils[0] = '0';
  }
  if (taskTimeMinutes < 10) {
    nils[1] = '0';
  }
  prettyTaskTime = nils[0] + taskTimeHours + ':' + nils[1] + taskTimeMinutes;

  return prettyTaskTime
}


function setTimeNow() {
  taskTime = new Date();
  fillTimeBox(taskTime);
}


function clearTimeBox() {
  document.getElementById('inputTimeBox').value = '';
  document.getElementById('apply').textContent = 'Ok (then tap where this task should be)';
  taskTimeHours = 0;
  taskTimeMinutes = 0;
}



function readTaskText() {
  let contentInputBox = document.getElementById('inputTaskBox').value.trim();
  let badCharacters = /[^a-zA-ZæøåÆØÅ\s\.\,\?\!\(\)\"]+/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage('Please don\'t use ' + badCharacters + ' for task description.', 3000);
  } else {
    taskText = contentInputBox;
    console.log(contentInputBox);
    returnTask();
  }
}


function readDurationTime() {
  let contentInputBox = document.getElementById('inputDurationBox').value.trim();
  let badCharacters = /[^0-9hm]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage('Please use the format 1h30m for 1 hour and 30 minutes', 3000);
  } else {
    let timeH = 0;
    let timeM = /\d{1,4}m?$/.exec(contentInputBox).toString(); // TODO: Check if numbers are too big
    timeM = Number(timeM.replace('m', ''));
    if (/h/.exec(contentInputBox)) {
      timeH = /[0-9]+h/.exec(contentInputBox).toString();
      contentInputBox = contentInputBox.replace(timeH, '');
      timeH = Number(timeH.replace('h', ''));
    }
    taskDuration = timeH * 60 + timeM;
  }
}


function readTaskStartTime() {
  let contentInputBox = document.getElementById('inputTimeBox').value.trim();
  let badCharacters = /[^0-9:]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage('Please use the format 12:00 or 1200', 3000);
  } else {
    let timeH = /[0-9][0-9]/.exec(contentInputBox);
    contentInputBox = contentInputBox.replace(timeH, '');
    let timeM = /[0-9][0-9]/.exec(contentInputBox);
    let now = new Date();
    taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM);
    if (0 < timeH || 0 < timeM) {
      fillTimeBox(taskTime);
    }
  }
}


function returnTask() {
  // readTaskText();
  if (taskText === '') {
    displayMessage('Please write a task text', 3000);
  } else {
    readDurationTime();
    readTaskStartTime();
    readDrainGainRadioButtons();
    formatTask();
    window.location.assign('main.html');
  }
}

function goToPage(page) {
  returnTask();

  // TODO: Make sure the data is stored the same way by all pages and retrieved as expected

  window.location.assign(page);
}

function justReturn() {
  window.location.assign('main.html');
}


function readDrainGainRadioButtons() {
  let radioButtonResult = document.getElementsByClassName('drain');
  for (var i = 0; i < 10; i++) {
    if (radioButtonResult[i].type === 'radio' && radioButtonResult[i].checked) {
      drainGainLevel = radioButtonResult[i].value;
    }
  }
}


function formatTask() {
  let returnText = '';
  if (document.getElementById('inputTimeBox').value.trim() === '') {
    returnText = taskText + ' ' + taskDuration + 'm ' + drainGainLevel;
  } else {
    let prettyTaskTime = prettifyTime(taskTime);
    returnText = taskText + ' ' + prettyTaskTime.replace(':', '') + ' ' + taskDuration + 'm ' + drainGainLevel;
  }
  localStorage.newTaskText = returnText;
  console.log(returnText);
}


function displayMessage(text, displayTime) { // displayTime in milliseconds
  console.log(text);
  msg = document.getElementById('message');
  msg.style.display = 'inline-block';
  msg.style.color = 'red';
  msg.textContent = text;
  msg.style.height = '40px';
  msg.style.marginTop = '20px';

  setTimeout(function() {msg.style.display = 'none';}, displayTime)
}


function parseCurrentTask(currentTask) {
  let minutes = /[0-9]+m/.exec(currentTask);
  if (minutes) { // If 30m is in currentTask store number in minutes and remove 30m from currentTask
    minutes = /[0-9]+/.exec(minutes).toString();
    currentTask = currentTask.replace(minutes + 'm', '');
  } else {
    minutes = '0';
  };

  let hours = /[0-9]+h/.exec(currentTask);
  if (hours) { // If 2h is in currentTask store number in minutes and remove 2h from currentTask
    hours = /[0-9]+/.exec(hours).toString();
    currentTask = currentTask.replace(hours + 'h', '');
  } else {
    hours = '0';
  };

  taskDuration = Number(hours * 60) + Number(minutes);
  if (taskDuration == 0) {
    taskDuration = defaultTaskDuration; // If no duration is provided use the default task duration
  }
  fillDurationBox(taskDuration);

  let time = /[0-9]?[0-9]:?[0-9][0-9]/.exec(currentTask);
  if (time) { // If 1230 or 12:30 is found in currentTask store numbers in hours and minutes and remove 1230 from currentTask
    time.toString().replace(':', '');
    time = time[0].toString();
    if (time.length == 4) {
      timeH = /[0-9][0-9]/.exec(time).toString();
    } else if (time.length == 3) {
      timeH = /[0-9]/.exec(time).toString();
    }
    time = time.replace(timeH, '');
    timeM = /[0-9][0-9]/.exec(time).toString();
    currentTask = currentTask.replace(timeH + timeM, '');
    // Make new datetime from timeM and timeH
    let now = new Date();
    taskStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM);  // NO need for DST shenanigans here!
    fillTimeBox(taskStart);
  };
  currentTask = currentTask.replace(time, '');

  let drain = /d+[-]*[1-9]+/.exec(currentTask);
  if (drain) {
    drainGainLevel = drain;
  } else {
    drainGainLevel = 'd1';
  };

  let gain = /g+[-]*[1-5]+/.exec(currentTask); // Gain counts double as the assumption is consious relaxation
  if (gain) {
    drainGainLevel = gain;
  };

  if (drain) {
    document.getElementById(drain).checked = 'checked';
  } else if (gain) {
    document.getElementById(gain).checked = 'checked';
  }
  currentTask = currentTask.replace(drain, '');
  currentTask = currentTask.replace(gain, '');

  document.getElementById('inputTaskBox').value = currentTask.trim();
}
