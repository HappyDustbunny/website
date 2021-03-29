let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthTaskDict = {};  // JS object usable much like a Python dictionary
let tasksOfTheChoosenDay = {};
let putBackId = '';
let tasksSentBetween = '';
// let clickedChooseBoxElement = null;
// let displayDict = {};    // JS object usable much like a Python dictionary
// let zoom = 0.5;  // The height of all elements will be multiplied with zoom. Values can be 1 or 0.5
// let zoomSymbolModifyer = 0; // The last digit of the \u numbers \u2357 ⍐ and \u2350 ⍗


// class Task { // TODO: Should the code be rewritten to use this class?
//   constructor(date, text) {
//     this.date = date;
//     this.text = text;
//     this.dateId = this.dateToId();
//     this.isClicked = 'isNotClicked'
//   }
//   dateToId() {
//     return this.date.getDate() + this.date.getMonth();
//   }
// }


function setUpFunc() {
  retrieveLocallyStoredStuff();

  fillDateBar();

  renderTasks();

  // resetInputBox();
  document.getElementById('inputBox').focus();
}


document.addEventListener('touchmove', function() {twoFingerNavigation(event);});

document.getElementById('day').addEventListener('click', function() {goToPage('main.html');});

document.getElementById('clearButton').addEventListener('click', clearBehavior);

// document.getElementById('inputBox').addEventListener('click', inputBoxHasBeenClicked);

document.getElementById('moveToDay').addEventListener('click', todayButtonHasBeenClicked);

document.getElementById('putBack').addEventListener('click', putBack);

document.getElementById('taskDiv').addEventListener('click', function () {taskHasBeenClicked(event); }, true);
// document.getElementById('taskDiv').addEventListener('dblclick', function () {taskHasBeenDoubleClicked(event); }, true);

document.getElementById('inputBox').addEventListener('keypress', function () { inputAtEnter(event); });

function storeLocally() {
  localStorage.monthListAsText = JSON.stringify(monthTaskDict);
  localStorage.tasksSentBetween = JSON.stringify(tasksSentBetween);
}


function retrieveLocallyStoredStuff() {
  if (localStorage.getItem('monthListAsText') != null) {
    monthTaskDict = JSON.parse(localStorage.monthListAsText);
  }

  if (localStorage.getItem('inputBoxContent') != '') {
    document.getElementById('inputBox').value = localStorage.getItem('inputBoxContent');
    localStorage.removeItem('inputBoxContent');
  }

  if (JSON.parse(localStorage.getItem('tasksSentBetween'))) {
    tasksOfTheChoosenDay = JSON.parse(localStorage.tasksSentBetween);
    fillChooseBox();
    localStorage.removeItem('tasksSentBetween');
  }
}


function fillDateBar() {
  let now = new Date();
  let nowPlus3Month =  new Date();
  nowPlus3Month = nowPlus3Month.setMonth(nowPlus3Month.getMonth() + 3);

  // Make the first button with monthname
  let thisMonth = now.getMonth();
  monthNameNode = document.createElement('button');
  monthNameNode.classList.add('monthName');
  monthNameNode.textContent = months[now.getMonth()];
  document.getElementById('taskDiv').appendChild(monthNameNode);

  for (let i = now; i < nowPlus3Month; i.setDate(i.getDate() + 1)) {
    // Insert monthnames before each the 1th
    if (thisMonth < i.getMonth() || (thisMonth === 11 && i.getMonth() === 0)) {  // Month 0 is january
      thisMonth = i.getMonth();
      monthNameNode = document.createElement('button');
      monthNameNode.classList.add('monthName');
      monthNameNode.textContent = months[i.getMonth()];
      document.getElementById('taskDiv').appendChild(monthNameNode);
    }

    let newNode = document.createElement('button');

    let id = i.getDate().toString() + i.getMonth().toString();

    newNode.setAttribute('id', id);
    newNode.setAttribute('class', 'isNotClicked');
    newNode.classList.add('dateButton');
    let dayNumber = i.getDay();
    if (dayNumber === 0 || dayNumber === 6) { // Weekday 6 and 0 are Saturday and Sunday
      newNode.classList.add('weekend');
    }

    datePart = document.createElement('span');
    datePart.classList.add('datePart');
    if (i.getDate() < 10) {
      datePart.textContent = '\u00a0\u00a0'; // Adjust all dates to align right
    }
    datePart.textContent += i.getDate() + '/' + (i.getMonth() + 1) +  '\u00a0\u00a0\u00a0';
    newNode.appendChild(datePart);

    toolTipSpan = document.createElement('span');
    toolTipSpan.classList.add('toolTip');
    newNode.appendChild(toolTipSpan);

    textPart = document.createElement('span');
    newNode.appendChild(textPart);

    document.getElementById('taskDiv').appendChild(newNode);
  }
}


function todayButtonHasBeenClicked() {
  tasksSentBetween += '|' + document.getElementById('inputBox').value;
  if (document.getElementById('chooseBox').classList.contains('active')) {
  } else {
    resetInputBox();
  }
}

function handleChoosebox() {
  let chooseBox = document.getElementById('chooseBox');

  if (chooseBox.classList.contains('active')) {
    if (chooseBox.hasChildNodes()) {
      document.getElementById('inputBox').value = chooseBox.firstChild.innerText;
      chooseBox.firstChild.remove();
    }
    if (!chooseBox.hasChildNodes()) {
      chooseBox.classList.remove('active');
      document.getElementById('putBack').classList.remove('active');
    }
  }
}

function taskHasBeenClicked(event) {
  let myId = event.target.id;
  if (myId === '') {
    myId = event.target.closest('button').nextSibling.id;
  }

  let text = document.getElementById('inputBox').value.trim();

  if (text != '' && event.target.classList.contains('isNotClicked')) {
    // Text in inputBox and no clicked date
    if (text != '') {
      monthTaskDict[myId] += '|' + text[0].toUpperCase() + text.slice(1);

      resetInputBox();

      handleChoosebox();
    }

    renderTasks();  // TODO: Fnug! Wrong choise. NEVER store information in the DOM. Implement Task-class

  } else if (text != '' && event.target.classList.contains('isClicked')) {
    // Text in inputBox and a clicked date. Should not happen.
    console.log('Text in inputBox and a clicked date. Should not happen.');
    event.target.setAttribute('class', 'isNotClicked');

  } else if (text === '' && event.target.classList.contains('isClicked')) {
    // No text in inputBox and a clicked date. Effectively a doubleclick
    if (document.getElementById('chooseBox').classList.contains('active')) {
      displayMessage('Please finish the current edit \nbefore starting a new', 3000);
    } else {
      let myId = event.target.id;
      if (myId === '') {
        myId = event.target.closest('button').nextSibling.id;
      }
      putBackId = myId;

      let day =  document.getElementById(myId).children;

      if (monthTaskDict[myId]) {
        tasksOfTheChoosenDay = monthTaskDict[myId];
        monthTaskDict[myId] = '';
        day[2].textContent = '';
        day[1].innerHTML = '';

        fillChooseBox();
      }
    }
    event.target.classList.add('isNotClicked');
    event.target.classList.remove('isClicked');

  } else {
    // No text in inputBox and no clicked date
    event.target.classList.remove('isNotClicked');
    event.target.classList.add('isClicked');
  }
}


function fillChooseBox() {
  let chooseBox = document.getElementById('chooseBox');
  chooseBox.classList.add('active');
  document.getElementById('putBack').classList.add('active');
  document.getElementById('moveToDay').classList.add('active');

  let tasks = tasksOfTheChoosenDay.trim().split('|');
  tasks.shift(); // Removes empty '' stemming from first |

  if (tasks != '') {
    let counter = 0;
    for (var task of tasks) {
      if (counter === 0) {
        document.getElementById('inputBox').value = task;
      } else {
        newButton = document.createElement('button');
        newButton.classList.add('floatingTask');
        newButton.textContent = task;
        newButton.setAttribute('id', 'task' + counter);
        // newButton.addEventListener('click', function () {floatingTaskHasBeenClicked(event);}, true);

        document.getElementById('chooseBox').appendChild(newButton);  // TODO: Set a lock on inputBox and tasks while chooseBox is active
      }

      counter += 1;
    }
  }
}


function putBack() { // TODO: Fix removal of postponed tasks from day i putBack is clicked. Maybe hide it?
  monthTaskDict[putBackId] = tasksOfTheChoosenDay;

  let chooseBox = document.getElementById('chooseBox');

  while (chooseBox.firstChild) {
    chooseBox.removeChild(chooseBox.lastChild);
  }

  chooseBox.classList.remove('active');
  document.getElementById('putBack').classList.remove('active');

  renderTasks();

  resetInputBox();
}

//
// function floatingTaskHasBeenClicked(event) {
//   let button = document.getElementById(event.target.id)
//   if (button.classList.contains('clicked')) {
//     button.classList.remove('clicked');
//     clickedChooseBoxElement = null;
//   } else {
//     button.classList.add('clicked');
//     clickedChooseBoxElement = button;
//   }
//   console.log(event.target.id);
// }

//
// function inputBoxHasBeenClicked() {
//   if (clickedChooseBoxElement) {
//     document.getElementById('inputBox').value = clickedChooseBoxElement.textContent;
//     cleanUpChooseBox();
//   }
// }

//
// function cleanUpChooseBox() {
//   clickedChooseBoxElement.remove();
//   if (!chooseBox.hasChildNodes()) {
//     chooseBox.classList.remove('active');
//     document.getElementById('putBack').classList.remove('active');
//   }
// }


function inputAtEnter(event) {
  if (event.key === 'Enter') {
    let contentInputBox = document.getElementById('inputBox').value.trim();
    if (contentInputBox != '') {

      let dateArray = /\d+\/\d+/.exec(contentInputBox);

      if ( dateArray != null ) {
        // Is it a legit date?
        if ( (/\d+\//.exec(dateArray[0])[0].replace('\/', '') <= 31 &&
          /\/\d+/.exec(dateArray[0])[0].replace('\/', '') <= 12)) {

            // Make myId from date
            let myId = (/\d+\//.exec(dateArray[0])[0].replace('\/', '')).toString() +
              (Number(/\/\d+/.exec(dateArray[0])[0].replace('\/', '')) - 1).toString()

            let textInputBox = contentInputBox.replace(dateArray[0], '').trim();

            if (textInputBox === '') {
              gotoDate(myId); // TODO: Make gotoDate() and sanitize input. The next line reacts badly to 1/12
            } else {
              monthTaskDict[myId] += '|' + textInputBox[0].toUpperCase() + textInputBox.slice(1);
            }

        } else {
          displayMessage('Not a date. Please fix date or remove the back-slash', 4000);
          return;
        }

      } else {
        let now = new Date();
        let nowPlusOneDay = new Date();
        nowPlusOneDay = new Date(nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1));
        let myId = nowPlusOneDay.getDate().toString() + nowPlusOneDay.getMonth().toString();

        monthTaskDict[myId] += '|' + contentInputBox[0].toUpperCase() + contentInputBox.slice(1);
      }

      renderTasks();

      resetInputBox();

    }
  }
}


function renderTasks() {
  // Store a backup of monthTaskDict
  let monthListAsText = JSON.stringify(monthTaskDict);
  if (monthListAsText) {
    localStorage.monthListAsText = monthListAsText;
  }


  // Remove old text from buttons and tooltips
  const days = document.getElementById('taskDiv').children;
  const len = days.length;
  for (var i = 0; i < len; i++) {
    if (days[i].children.length > 0) {
      days[i].children[2].textContent = '';
      days[i].children[1].innerHTML = '';
    }
  }

  // Write new text into buttons and tooltips
  for (var myId in monthTaskDict) {
    let button = document.getElementById(myId);

    if (button != null && button.class != 'weekend') {
      let children = button.childNodes;  // datePart, toolTip and text

      let tasks = monthTaskDict[myId].trim().split("|");
      tasks.shift();  // Remove empty "" stemming from first |

      if (tasks != '') {
        for (var task of tasks) {
          children[1].innerHTML += ' \u25CF ' + task + '&nbsp;' + '<br>'; // Write to tooltip
          children[2].textContent +=  ' \u25CF ' + task + '\u00a0'; // Write task to date
        }
      }
    }
  }
}


function clearBehavior() {
  if (document.getElementById('inputBox').value === '') {
    alert('To clear all information in this calendar, clear your browser data (Site data).\n\n' +
    'Go to your browsers Settings or Options and look for Delete cookies and site data.\n\n' +
    'This option may be under Privacy or Security.');
  } else {
    resetInputBox();
  }
}


function resetInputBox() {
  document.getElementById('inputBox').value = '';
  document.getElementById('inputBox').focus();
  handleChoosebox();
}


function twoFingerNavigation(event) {
  if (sessionStorage.touchXmonth && event.touches.length === 1) {
    sessionStorage.touchXmonth = '';
  }
  if (event.touches.length > 1) {
    if (!sessionStorage.touchXmonth) {
      sessionStorage.touchXmonth = event.touches[0].screenX;
    } else if (event.touches[0].screenX - sessionStorage.touchXmonth < 50) { // Left swipe
      goToPage('main.html');
    // } else if (event.touches[0].screenX - sessionStorage.touchXmonth > 50) { // Right swipe
    //   goToPage('month.html');
    }
  }
}


function goToPage(page) { // TODO: What if you go to a page where inputBoxContent isn't needed?
  storeLocally();

  let inputBoxContent = document.getElementById('inputBox').value;
  if (inputBoxContent != '') {
    localStorage.inputBoxContent = inputBoxContent;
  }

  window.location.assign(page);
}


function gotoDate() {
  console.log('To do: make jumping to date possible');
}


function displayMessage(text, displayTime) {
  console.log(text);
  msg = document.getElementById('message');
  msg.style.display = 'inline-block';
  msg.style.color = 'red';
  msg.textContent = text;

  setTimeout(function() {msg.style.display = 'none';}, displayTime)
}
