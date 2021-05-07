// TODO: anneal() after double-clicking task?


let taskList = [];  // List of all tasks
let displayList = [];  // All tasks to be displayed, inclusive nullTime tasks
let startAndEndTimes = [];
let chosenTask = '';
let chosenTaskId = '';
let idOfLastTouched = 0;
let uniqueIdOfLastTouched = 0;
let uniqueIdList = []; // Used by the class Task only
let nullTimeClicked = false;
let zoom = 1.0;  // The height of all elements will be multiplied with zoom. Values can be 1 or 0.5
let zoomSymbolModifyer = 0; // The last digit of the \u numbers \u2357 ⍐ and \u2350 ⍗
let defaultTaskDuration = 30;
let wakeUpH = 7;  // The hour your day start according to settings. This is default first time the page is loaded
let wakeUpM = 0;  // The minutes your day start according to settings
let wakeUpOrNowClickedOnce = false;
let wakeUpStress = 1;  // Stress level is a integer between 1 and 5 denoting percieved stress level with 1 as totally relaxed and 5 stress meltdown
// let stressLevel = wakeUpStress;
let tDouble = 240;  // Doubling time for stress level in minutes
let msgTimeOutID = null; // Used in stopTimeout() for removing a timeout for messages
let taskAlarms = 'off'; // Turn alarms off by defalult
let reminder = 'off'; // Turn reminders off by default
let tasksFromClickedDayInMonth = null;
let tasksSentBetween = [];
let language = 0; // English: 0, Danish: 1
let lang = ['en', 'da'];

///////// Add-view /////////
let taskText_add = '';
let taskDuration_add = defaultTaskDuration;
let taskTime_add = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 00);
let drainGainLevel_add = 'd1';

///////// Month-view ////////
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthTaskList = {};  // Dict with all tasks storede in month-view. Technically a JS object usable much like a Python dictionary
let pastDayList = {};   // Old taskList is stored here on their relevant date {"4-1-21": [task, task,...]}
let trackTaskList = {}; // Each tracked task have a text-key and a colour and an opacity  Ex: {'morgenprogram': ['#00FF00', '1']}
// let trackTaskList = {'morgenprogram': ['#00FF00', '1'], 'frokost': ['#DD0000', '1'], 'programmere': ['#0000FF', '1']}; // Each tracked task have a text-key and a colour and an opacity  Ex: {'morgenprogram': ['#00FF00', '1']}
let putBackId = '';

///////// Track-view ////////
let colours = [
'Aquamarine','LightBlue', 'SkyBlue', 'SteelBlue', 'Turquoise', 'DarkTurquoise', 'DarkCyan',
'Cyan','DeepSkyBlue','RoyalBlue','DarkBlue','Blue','Indigo','BlueViolet','Purple','Magenta',
'Violet','DeepPink','Crimson','Red','Tomato','Salmon','Sienna','Chocolate','Brown','Khaki',
'Gold','Yellow','GreenYellow' ,'LawnGreen','LightGreen','SpringGreen','Lime','LimeGreen',
'ForestGreen','Green','DarkGreen','Lightgrey','Darkgrey','grey'
]

///////// Storage-view ///////
let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
'Sunday', 'Extra Store 1', 'Extra Store 2', 'Extra Store 3'];
let ugeDage = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag',
'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag',
'Ekstralager 1', 'Ekstralager 2', 'Ekstralager 3']; // TODO: Fix weekdays translation
let storageList = {};  // taskList and their names are stored in memory1-17  {'memory1': [[task, task, ...], 'name']}

///////// Languages ///////
let languagePack = {  // {'id': [['text', 'title'], ['tekst', 'titel']]} The variable language is 0 for english and 1 for danish
   // Day view
     "month": [['Month', 'Click to show month (or just swipe rigth with two fingers anywhere)'],
               ['Måned', 'Klik for at vise måned (eller swipe til højre med to fingre)']],
     "storage": [['Storage', 'Click to show the storage (or just swipe left with two fingers anywhere)'],
                 ['Lagre', 'Klik for at vise lagrene (eller swipe til venstre med to fingre)']],
     'info': [['?', "Information and user manual"],
        ['?', 'Information og brugsanvisning']],
     "postpone": [['\u25C2 Postpone', "Click to move content of input box to month (postpone task)"], // &#x25C2; Black left-pointing small triangle
                  ['\u25C2 Udskyd', "Klik for at sende indholdet af indput-boxen til månedsvisningen (udskyd opgaven)"]],
     'upButton': [['\u25BE 7:00', "Click to insert a 15 minute planning period at the chosen wake up time"],  // &#x25BE; Black Down-Pointing Small Triangle
                  ['\u25BE 7:00', "Klik for at indsætte en 15 minutteres planlægnings periode på den valgte opvågningstid "]],
     'upButtonRegular': [['\u25BE ', "Click to insert a 15 minute planning period at the chosen wake up time"],  // &#x25BE; Black Down-Pointing Small Triangle
                  ['\u25BE ', "Klik for at indsætte en 15 minutteres planlægnings periode på den valgte opvågningstid "]],
     'upButtonJump': [['\u25B8 ', "Click to jump to the chosen wake up time"],  // &#x25B8; Black Right-Pointing Small Triangle
                  ['\u25B8 ', "Klik for at hoppe til den valgte opvågningstid "]],
     'nowButton': [['Now \u25BE', 'Click to insert a 15 min planning period at current time'],  // \u25BE <!-- Black Down-Pointing Small Triangle -->
                  ['Nu \u25BE', 'Klik for at indsætte en 15 minutteres planlægnings periode på nuværende tidspunkt.']],
     'toDoButton': [['To do ...', 'Click to view due tasks from Month view'],
                    ['Husk at ...', 'Klik for at se forfaldne opgaver fra Månedsvisningen']],
     'nowButtonJump': [['\u25B8 Now', 'Click to jump to current time'],  // \u25B8 <!-- Black Right-Pointing Small Triangle -->
                  ['\u25B8 Nu', 'Klik for at hoppe til nuværende tidspunkt.']],
     'clearButton': [['\u25BEClear', "Clear all tasks"],  // <!-- Black down-pointing small triangle  -->
                     ['\u25BESlet', 'Slet alle opgaver']],
     'clearButtonText': [['\u25C2Clear', "Clear textbox"],  // Black left-pointing small triangle
                     ['\u25C2Slet', 'Slet inputbox']],
     'gotoSettings': [['\u2699', 'Settings'],  // Gear icon
                      ['\u2699', 'Indstillinger']],
     'zoom': [['\u2350', 'Toggles zoom'],  // ⍐
              ['\u2350', 'Zoom ind og ud']],
     'spacerText': [['This space is to allow scrolling to the end of the day when the screen keyboard is active.', ''],
              ['Dette blanke område er for at man kan scrolle til slutningen af dagen, når skærmtastaturet er aktivt.', '']],
    // Add view
     'addTaskHeading': [['Add task', ''],
                        ['Tilføj opgave', '']],
     'inputBox_add_text': [['Task text', ''],
                           ['Opave tekst', '']],
     'inputBox_add': [['', 'Write task text'],
                      ['', 'Skriv en opgavetekst']],
     'inputDurationBox_text': [['Duration\u00a0', ''],
                               ['Varighed\u00a0', '']],
     'inputDurationBox': [['', 'Write duration in minutes'],
                          ['', 'Skriv varigheden i minutter']],
     'inputTimeBoxText': [['Task starts at', ''],
                          ['Opgaven starter kl', '']],
     'inputTimeBox': [['', 'Write time here'],
                      ['', 'Skriv tiden her']],
     'optional': [['(optional)', ''],
                  ['(Ikke påkrævet)', '']],
     'now': [['Now', 'Set time to now'],
             ['Nu', 'Sæt tiden til nu']],
     'clear': [['Clear', 'Clear time'],
               ['Slet', 'Slet tidspunkt']],
     'drainLevelText': [['\u00a0 Drain level', ''],
                        ['\u00a0 Dræningsniveau', '']],
     'grainLevelText': [['Gain level', ''],
                        ['Gavnlighedsniveau', '']],
     'addInfo': [['?', 'Information and user manual'],
        ['?', 'Information og brugsanvisning']],
     'cancel': [['Cancel', ''],
                ['Afbryd', '']],
     'apply': [['OK', ''],
        ['OK', '']],
     'applyButtonText': [['Ok (Then tap where this task should be)', ''],
        ['OK (Klik der hvor opgaven skal inds&aelig;ttes)', '']],
      // Month View
     'track': [['Track', 'Choose which task to track with colours'],
               ['Følg', 'Vælg hvilke opgaver der skal følges']],
     'day': [['Day', 'Click to get back to day-view (or just swipe left with two fingers anywhere)'],
             ['Dag', 'Klik for at komme tilbage til dagsvisning (eller swipe til venstre med to fingre hvorsomhelst)']],
     'monthClearButton': [['Clear\u25B8', 'Clear input box'], // Black right-pointing small triangle
        ['Slet \u25B8', 'Slet input boks']],
     'monthInputBox': [['', 'Input tasks to store in month view'],
                       ['', 'Skriv opgaver der skal gemmes i månedsvisningen']],
     'moveToDay': [['Today \u25B8', 'Click to move content of input box to today\'s plan'], // Black right-pointing small triangle
                   ['I dag \u25B8', 'Klik for at flytte indholdet af inputboxen til dagens plan']],
     'putBack': [['Put back', 'Put the tasks back in month view'],
        ['Fortryd', 'Sæt opgaverne tilbage i månedsvisningen']],
     'trackViewHeading': [['Choose tasks to track', ''],
                          ['Vælg opgaver der skal følges', '']],
     'month1': [['Month', 'Click to get back to month-view'],
                ['Måned', 'Klik for at komme tilbage til månedsvisningen']],
     'trackText': [['Track\u00a0', ''],
                   ['Følg\u00a0', '']],
     'taskPickerInputBox': [['', 'Write task text for the task you want to track'],
                            ['', 'Skriv opgaveteksten for den opgave du vil følge']],
      'colourText': [['Colour\u00a0', ''],
                     ['Farve\u00a0', '']],
     'colourPickerInputBox': [['', 'Write colour name or rgb-value or hex-value'],
                              ['', 'Skriv farvenavn (på engelsk) eller rgb-værdi eller hex-værdi for farven']],
     'trackedItemsText': [['Tracked tasks', ''],
                          ['Opgaver der følges', '']],
     'deleteTrackedButton': [['Remove UNcheked tasks from this list', ''],
                             ['Fjern opgaver UDEN flueben fra denne liste', '']],
    // Storage view
     'storageHeadingText': [['Store or retrive tasklists', ''],
                            ['Gem eller gendan opgavelister', '']],
     'storeList': [['Store list in', 'To clear a stored list, just store an empty list'],
                   ['Gem liste i', 'Gem en tom liste for at slette en gemt liste.']],
     'trashBin': [['Restore last discarded task list', ''],
                  ['Gendan sidst slettede liste', '']],
    // Settings view
     'gotoDayFromSettings': [['Day', 'Click to get back to day-view'],
                             ['Dag', 'Klik for at vende tilbage til dagsvisning']],
     'settingsHeading': [['Settings', ''],
                         ['Indstillinger', '']],
     'languageHeading': [['Language', ''],
                          ['Sprog', '']],
     'apply0': [['Apply', ''],
                ['Andvend', '']],
     'taskDurationHeading': [['Default task duration', ''],
                   ['Standard opgavelængde', '']],
     'taskDurationText': [['Set default task duration in minutes:', ''],
                          ['Sæt stadard opgavelængde i minutter', '']],
     'inputBoxM': [['', 'Set default task duration in minutes'],
                   ['', 'Sæt standardlængden for opgaver i minutter']],
     'apply1': [['Apply', ''],
                ['Andvend', '']],
     'playTocText': [['Play \'toc\' sound', ''],
                     ['Afspil \'tac\' lyd', '']],
      'tocLabelOff': [['Off', ''],
                      ['Fra', '']],
     'tocLabelStart': [['At the beginning of tasks (toc)', ''],
                       ['I begyndelsen af en opgave (tac)', '']],
     'tocLabelEnd': [['At the end of tasks (toc toc)', ''],
                     ['I slutningen af en opgave (tac tac)', '']],
     'tocLabelBoth': [['Both at beginning and end of tasks', ''],
                      ['Både når opgaven starter og slutter', '']],
     'playTicText': [['Play \'tic\' sound', ''],
                     ['Afspil \'tic\' lyd', '']],
     'ticLabelOff': [['Off', ''],
                     ['Fra', '']],
     'ticLabelEachX': [['Every X minutes', ''],
                       ['Hver X. minut', '']],
     'ticLabelRandom': [['Randomly within every X minutes', ''],
                        ['Tilfældigt indenfor X minutter', '']],
     'ticSpanInterval': [['Time interval X in minutes:', ''],
                         ['Tidsinterval X i minutter:', '']],
     'inputBoxX': [['', 'Time interval X in minutes'],
                   ['', 'Tidsinterval X i minutter']],
     'apply2': [['Apply', ''],
                ['Anvend', '']],
     'noteSpan': [['Note:\r\nThe sound only play if the page has focus', ''],
                  ['Bemærk:\r\nLyd afspilles kun, hvis siden har fokus', '']],
     'stressModelHeading': [['Stress Model', ''],
                       ['Stress Model', '']],
     'settingsInfo': [['?', 'Information about the stress model'],
                       ['?', 'Information om stressmodellen']],
     'stressLevelText': [['Set the stress level you experience\r\nwhen you wake up (1-5, 1 is low)\u00a0', ''],
                         ['Angiv det stressniveau du oplever\r\nnår du vågner (1-5, 1 er lavt)\u00a0', '']],
     'stressLevelDoubleText': [['Set the approximately time for\r\nyour stress level to '
                                + 'double\r\nwhen working without pause', ''],
                               ['Sæt den tid det omtrent tager\r\nfør dit stressniveau '
                                + 'fordobles,\r\nnår du arbejder uden pause', '']],
      'apply3': [['Apply', ''],
      ['Anvend', '']],
     'clearDataHeading': [['Clear data and preferences', ''],
                          ['Slet data og indstillinger', '']],
     'clearAllData': [['Clear all data', ''],
                      ['Slet alle data', '']],
     'clearEverything': [['Clear all data and preferences', ''],
                         ['Slet alle data og indstillinger', '']],
     'gotoDayFromSettings1': [['Go back', ''],
                       ['Gå tilbage', '']],
    // Messages
     'dontUse': [['Please don\'t use ' , ' for task description'],
                 ['Undlad venligst at bruge ', 'til at beskrive opgaver']],
     'format1h30m': ['Please use the format 1h30m for 1 hour and 30 minutes',
                     'Brug formatet 1h30m for 1 time og 30 minutter'],
     'format1200': ['Please use the format 12:00 or 1200',
                    'Brug formatet 12:00 eller 1200'],
     'taskTextMsg': ['Please write a task text',
                     'Skriv en opgavetekst'],
     'noPastDates': ['Past dates can not be assigned tasks until a time machine has been invented',
                     'Datoer i fortiden kan ikke tildeles opgaver før der bliver opfundet en tidsmaskine'],
     'useDayView': ['Use Day-view for today\'s tasks',
                    'Brug dagsvisning for dagens opgaver'],
     'finishTaskFirst': ['Please finish the current edit \nbefore starting a new',
                         'Afslut redigeringen før du starter en ny opgave'],
     'notADate': ['Not a date.\nPlease fix date or remove the back-slash',
                  'Det er ikke en dato.\nVær venlig at angive en rigtig dato eller fjern skråstregen'],
     'addATask': ['Please add a task',
                  'Tilføj venligst en opgave'],
     'removeUnchecked?': ['Do you want to remove all UNcheked tasks from this list?\n (The same tasks elsewhere is not affected)',
                          'Vil du fjerne alle opgaver UDEN flueben fra denne liste?\n (Dette påvirker ikke opgaverne andre steder)'],
     'nothingChanged': ['Nothing was changed',
                        'Der skete ingen ændringer'],
     'nothingIsDiscarded': ['No task has been discarded yet.\nNothing was changed.',
                            'Ingen opgaver er blevet smidt ud endnu\nIntet er ændret'],
     'changeLabel?': ['Change label of the stored list?\n(Clicking OK will erase earlier content)',
                      'Vil du ændre navnet på den gemte liste?\n(Tidligere indhold vil blive slettet hvis du klikker OK)'],
     'onlyAlphaNumerics': ['Limit your charcters to letters and numbers, please.',
                           'Brug venligst kun bogstaver og tal'],
     'listCleared': ['Stored list is cleared',
                     'Den gemte liste er slettet'],
     'listStoredIn': ['Current task list stored in ',
                      'Dagens liste er gemt i '],
     'restoreLast': ['Restore last discarded task list',
                     'Genskab den sidst forkastede liste'],
     'retrieveFrom': [['Retrieving list from the \"', '\" storage'],
                      ['Henter listen fra lageret \"', '\"']],
     'storeIsEmpty': ['This store is empty',
                      'Dette lager er tomt'],
     'only0-1438': ['Use only numbers between 0 and 1438, please.',
                    'Brug venligst kun tal mellem 0 og 1438'],
     'only0-59': ['Use only numbers between 0 and 59, please.',
                  'Brug venligst kun tal mellem  0 og 59'],
     'only0-5': ['Use only numbers between 0 and 5, please',
                 'Brug venligst kun tal mellem 0 og 5'],
     'formatReminder': ['The format should be \r\n1200 1h30m text OR\r\n1200 text OR\r\n text OR \r\n800 or 1230',
                        'Formatet bør være \r\n1200 1h30m tekst ELLER\r\n1200 tekst ELLER\r\n tekst ELLER \r\n800 eller 1230'],
     'startWithFixed': ['\nPlease start planning with a fixed time \n\nEither press "Now" or add a task at\n6:00 by typing "600 15m planning"\n',
                        '\nStart dagen med en opgave med fast tid\n\nTryk enten på "Nu" knappen eller tilføj\n en opgave kl 6:00 ved \nat skrive "600 15m planlægning"'],
     'notEnoughRoom': ['Not enough room. \nPlease clear some space',
                       'Der er ikke plads til en opgave\naf den længde her'],
     'overlap': ['There is an overlap with another fixed time',
                 'Der er et overlap med en anden opgave med fast tid'],
     'fixedTaskClicked': ['One of the clicked tasks is fixed. \nFixed task can not be swapped. \nPlease edit before swap.',
                          'En af de klikkede opgaver har fast tid\nOpgaver med fast tid kan ikke byttes rundt\nRet opgaven med fast tid før der byttes'],
     'jumpedTo': ['Jumped to ',
                  'Sprang til '],
     'numberNotRecognized': ['Number not recognised as a time',
                             'Tallet blev ikke genkendt som en tid'],
     'sureYouWannaClear?': ['The data can NOT be retrieved. Are you SURE you want to delete all data, including tasks on past days?',
                            'Dataene kan IKKE genskabes. Er du SIKKER på at du vil slette alle data, inklusive opgaver i fortiden?'],
     'reallySure?': ['All data and preferences will be cleared. \n\nThey can NOT be retrieved.\n\nAre you SURE you want to delete everything?\n\n',
                     'Alle data og indstillinger vil blive slettet\n\nDe kan IKKE blive gendannet.\n\nEr du SIKKER på at du vil slette alt?\n\n'],
     'nothingWasDeleted': ['Nothing was deleted.',
                           'Intet blev slettet'],
     'removeAllTasks?': ['Do you want to remove all tasks and start planning a new day?',
                         'Vil du fjerne alle opgaver og starte planlægning af en ny dag?'],
     'removeAllReminder': ['If you want to remove all tasks and settings go to Settings (Gear symbol in Day View)',
                           'Hvis du vil fjerne alle opgaver og indstillinger, så gå til Indstillinger (Tandhjulssymbolet i Dagsvisning)'],
};


// Daylight saving time shenanigans
let today = new Date();
let january = new Date(today.getFullYear(), 0, 1);
let july = new Date(today.getFullYear(), 6, 1);
const dstOffset = (july.getTimezoneOffset() - january.getTimezoneOffset()) * 60000; // Daylight saving time offset in ms

// Task-object. Each task will be an object of this type
class Task {
  constructor(date, duration, text, drain) {
    this.date = date; // Start time as Javascript date
    this.duration = duration; // Duration in milliseconds
    this.text = text;
    this.drain = Number(drain);  // drain is a number between -5 and 5. Gain is negative drain.
    this.uniqueId = this.giveAUniqueId(); // nullTimes will end up generating unique ids in uniqueIdList which is not used because they get their predecessors id+n. And new nullTimes is generated with each redraw
    this.end = this.end();
    this.height = this.height();
    this.isClicked = 'isNotClicked'
  }

  giveAUniqueId() {
    let tryAgain = false;
    let uniqueId = 0;
    do {
      tryAgain = false;
      uniqueId = Math.floor(Math.random() * 10000);
      for (const [index, id] of uniqueIdList.entries()) {
        if (uniqueId.toString() === id.toString()) {
          tryAgain = true;
          break;
        }
      }
    }
    while (tryAgain);

    uniqueIdList.push(uniqueId);
    return uniqueId;
  }

  end() { // End time as Javascript date
    if (this.date != '') {
      return new Date(this.date.getTime() + this.duration);
    }
  }

  height() { // Pixelheight is 1 minute = 1 px
    return this.duration / 60000;
  }
}

// TODO: Fix the way tasks from monthView show up in dayView at the start of a new planning period
// TODO: Make weekends stand out in the past too in month-view

function setViewSize() {
  let height = window.screen.availHeight - 220;
  document.getElementById('container').style.height = height + 'px'
}


// Runs when the page is loaded:
function setUpFunc() {
  taskList = [];

  // setViewSize();  // TODO: Remove this function?

  makeFirstTasks();

  retrieveLocallyStoredStuff();

  resetViews();

  renderLanguage();

  // adjustNowAndWakeUpButtons();

  // Set uniqueIdOfLastTouche to the last task before 'Day end'
  uniqueIdOfLastTouched = taskList[taskList.length - 2].uniqueId;

  fillTimeBar(zoom);

  createTimeMarker();

  updateTimeMarker();

  // debugExamples(); // Make debug example tasks. Run from commandline if needed. DO NOT UNCOMMENT

  adjustNowAndWakeUpButtons();  // Needs to be after the first tasks is pushed to taskList because of renderTasks()
  // renderTasks();  // Is in adjustNowAndWakeUpButtons

  getDueRemindersFromLast3Months();

  jumpToNow();

  updateHearts(); // Update hearts to current time

  document.getElementById('dayInputBox').focus();
}


function createTimeMarker() {
  // Create time marker to show current time on timebar
  let nowSpan = document.createElement('span');
  nowSpan.setAttribute('id', 'nowSpan');
  document.getElementById('container').appendChild(nowSpan);
}


function makeFirstTasks() {
  // Make the first tasks. Necessary for adding new tasks
  let startList = ['000 1m Day start', '2359 1m Day end'];
  for (const [index, text] of startList.entries()) {
    parsedList = parseText(text.trim());
    let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
    task.fuzzyness = 'isNotFuzzy';
    taskList.push(task);
  }
}


function storeLocally() {
  localStorage.taskList = JSON.stringify(taskList);

  localStorage.wakeUpOrNowClickedOnce = wakeUpOrNowClickedOnce;

  localStorage.zoom = zoom;

  localStorage.defaultTaskDuration = defaultTaskDuration;

  localStorage.wakeUpStress = wakeUpStress;

  localStorage.tDouble = tDouble;

  localStorage.idOflastTouched = idOfLastTouched;

  localStorage.language = language;   // Value 0:English 1:Danish

  // if (tasksSentBetween) { // TODO: Is this used?
  //   localStorage.tasksSentBetween = JSON.stringify(tasksSentBetween);
  // }

  if (monthTaskList) {
    localStorage.monthTaskList = JSON.stringify(monthTaskList);
  }

  if (trackTaskList) {
    localStorage.trackTaskList = JSON.stringify(trackTaskList);
  }

  // Store today in pastDayList
  let now = new Date();
  let id = now.getDate().toString() + '-' + now.getMonth().toString() + '-' + now.getFullYear();
  pastDayList[id] = deepCopyFunc(taskList);  //  Func is used to make a deep copy

  // Store pastDayList
  if (pastDayList) {
    localStorage.pastDayList = JSON.stringify(pastDayList);
  }

  // Store storageList
  if (storageList) {
    localStorage.storageList = JSON.stringify(storageList);
  }
}


function deepCopyFunc(original) {
  if (typeof original != 'object' || original === null || // typeof null is 'object', hence the latter check
    Object.prototype.toString.call(original) === '[object Date]') { // Dates have to be returned as-is
    return original
  }

  let deepCopy = {};  // Assume deepCopy is an object
  if (Array.isArray(original)) { // Change it if it turns out to be an array
    deepCopy = [];
  }

  for (var key in original) {
    let value = original[key];

    deepCopy[key] = deepCopyFunc(value);  // Recursively travel the object for objects
  }

  return deepCopy
}


function fixDatesInList(list) {
  let now = new Date();
  for (const [index, task] of list.entries()) {
    task.date = new Date(task.date);
    if (!task.date) {debugger};
    task.date.setDate(now.getDate());
    task.end = new Date(task.end);
    task.end.setDate(now.getDate());
  }
  return list
}


function retrieveLocallyStoredStuff() {

  if (localStorage.getItem('taskList')) {
    let list = JSON.parse(localStorage.taskList);
    taskList = fixDatesInList(list);
    // Fix dates messed up by JSON.stringify - and bring them up to current date
    // let now = new Date();
    // for (const [index, task] of taskList.entries()) {
    //   task.date = new Date(task.date);
    //   task.date.setDate(now.getDate());
    //   task.end = new Date(task.end);
    //   task.end.setDate(now.getDate());
    // }
  }

  if (localStorage.getItem('wakeUpOrNowClickedOnce') == 'true') {
    wakeUpOrNowClickedOnce = true;
  } else {
    wakeUpOrNowClickedOnce = false;
  }

  if (localStorage.getItem('zoom')) {
    zoom = localStorage.zoom;
  }

  if (localStorage.getItem('defaultTaskDuration')) {
    defaultTaskDuration = localStorage.defaultTaskDuration;
  }

  if (localStorage.getItem('wakeUpStress')) {
    wakeUpStress = localStorage.wakeUpStress;
  }

  if (localStorage.getItem('tDouble')) {
    tDouble = localStorage.tDouble;
  }

  if (!localStorage.getItem('idOfLastTouched')) { // If NOT present...
    localStorage.idOfLastTouched = 0;
  }

  if (localStorage.getItem('language')) {
    language = Number(localStorage.language);   // Value 0:English 1:Danish
  }

  if (localStorage.getItem('monthTaskList')) {
    monthTaskList = JSON.parse(localStorage.getItem('monthTaskList'));
  }

  if (localStorage.getItem('trackTaskList')) {
    trackTaskList = JSON.parse(localStorage.getItem('trackTaskList'));
  }

  if (localStorage.getItem('pastDayList')) {
    pastDayList = JSON.parse(localStorage.getItem('pastDayList'));
    // Fix dates messed up by JSON.stringify
    for (const key in pastDayList) {
      pastDayList[key] = fixDatesInList(pastDayList[key]);
      // for (const index in pastDayList[key]) {
      //   pastDayList[key][index].date = new Date(pastDayList[key][index].date);
      //   pastDayList[key][index].end = new Date(pastDayList[key][index].end);
      // }
    }
  }

  if (localStorage.getItem('storageList')) {
    storageList = JSON.parse(localStorage.getItem('storageList'));
    // Fix dates messed up by JSON.stringify
    for (const key in storageList) {
      storageList[key][0] = fixDatesInList(storageList[key][0]);
      // for (const index in storageList[key][0]) {
      //   storageList[key][0][index].date = new Date(storageList[key][0][index].date);
      //   storageList[key][0][index].end = new Date(storageList[key][0][index].end);
      // }
    }
  }
}

function toDoButtonClicked() {
  fillChooseBox('day');
  toDoButton = document.getElementById('toDoButton');
  toDoButton.hidden = true;
  toDoButton.title = languagePack['toDoButton'][language][1];
  toDoButton.textContent = languagePack['toDoButton'][language][0];
}

function getDueRemindersFromLast3Months() {  // If the day in the list lies in the past kick tasks to chooseBox
  let now = new Date();
  now = new Date(now.setDate(now.getDate() + 1)); // To include today in the next for-loop
  let nowMinus3Month = new Date();
  nowMinus3Month = new Date(nowMinus3Month.setMonth(nowMinus3Month.getMonth() - 3));

  for (let i = nowMinus3Month; i < now; i.setDate(i.getDate() + 1)) {
    let myId = i.getDate().toString() + '-' + i.getMonth().toString()  + '-' + i.getFullYear().toString();

    if (monthTaskList[myId]) {
      thisDay = monthTaskList[myId];
      if (0 < tasksSentBetween.length) {
        Object.assign(tasksSentBetween, thisDay); // Joins two objects by modifying the first with the added values https://attacomsian.com/blog/javascript-merge-objects
      } else {
        tasksSentBetween = thisDay;
      }

      delete monthTaskList[myId];
    }
  }

  if (0 < tasksSentBetween.length) {
    document.getElementById('toDoButton').hidden = false;
    // fillChooseBox('day');
  }
}


function fillChooseBox(whichView) {  // whichView can be 'month' or 'day'
  let chooseBox = document.getElementById(whichView + 'ChooseBox');
  chooseBox.classList.add('active');
  let tasks = [];

  if (whichView != 'day') { // whichView is 'month'
    document.getElementById('putBack').classList.add('active');
    document.getElementById('moveToDay').classList.add('active');

    if (0 < tasksSentBetween.length) {
      tasks = tasksSentBetween;
    } else if (0 < tasksFromClickedDayInMonth.length) {
      tasks = tasksFromClickedDayInMonth ;
    } else {
      console.log('Nothing to show in ChooseBox');
    }

  } else {  // whichView is 'day'
    document.getElementById('postpone').classList.add('active'); // TODO: Is the class 'active' used? Nope. Should it be?

    tasks = tasksSentBetween;

    if (tasks.length === 0) {
      document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
    } else {
      document.getElementById('sortTask').setAttribute('class', 'tasksToSort');
    }

  }

  if (tasks.length > 0) {
    let counter = 0;
    for (var task of tasks) {
      if (counter === 0) {
        document.getElementById(whichView + 'InputBox').value = task.text;
      } else {
        newButton = document.createElement('button');
        newButton.classList.add('floatingTask');
        newButton.textContent = task.text;
        newButton.setAttribute('id', 'task' + counter);

        document.getElementById(whichView + 'ChooseBox').appendChild(newButton);
      }

      counter += 1;
    }
    let clearButton = document.getElementById('clearButton');
    clearButton.textContent = languagePack['clearButtonText'][language][0];  // Black left-pointing small triangle
    clearButton.title = languagePack['clearButtonText'][language][1];
  }

  tasksSentBetween = [];
  // tasksFromClickedDayInMonth = [];  // If this is emptied here putBack will have nothing to put back. It should be emptied elsewhere. Or after a test here
  // TODO: Postpone can leave tasks with an end that doesn't match duration and start time

}


function postponeTask() {
  let contentInputBox = document.getElementById('dayInputBox').value.trim();
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
  tasksSentBetween.push(task);

  if (!document.getElementById('dayChooseBox').classList.contains('active')) {
    document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
  }
  anneal();
  renderTasks();
  handleChoosebox('day');
  fixClearButtonArrow();
  resetInputBox('day');
}

function moveToDay() {
  let contentInputBox = document.getElementById('monthInputBox').value.trim();
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
  tasksSentBetween.push(task);
  resetInputBox('month');
}

// Clear input box and give it focus
function resetInputBox(whichView) { // whichView can be 'day' or 'month'
  document.getElementById(whichView + 'InputBox').value = '';
  document.getElementById(whichView + 'InputBox').focus();
  handleChoosebox(whichView);
}


function handleChoosebox(whichView) {  // TODO: If task is edited and inserted while choosebox is active it forget all about chooseBox
  let chooseBox = document.getElementById(whichView + 'ChooseBox');

  if (chooseBox && chooseBox.classList.contains('active')) {
    if (chooseBox.hasChildNodes()) {
      document.getElementById(whichView + 'InputBox').value = chooseBox.firstChild.innerText;
      chooseBox.firstChild.remove();
    } else {
      chooseBox.classList.remove('active');

      document.getElementById('putBack').classList.remove('active');
      document.getElementById('moveToDay').classList.remove('active');
    }
  }
}


// Clear input box and let it loose focus
function looseInputBoxFocus(whichView) {
  document.getElementById(whichView + 'InputBox').value = '';
  document.getElementById(whichView + 'InputBox').blur();
}

// Fill the half hour time slots of the timebar
function fillTimeBar(zoom) {
  for (let i = 0; i < 24; i += 1) {
    let halfHourA = document.createElement('div');  // This IS the most readable and efficient way to make the required text
    let halfHourB = document.createElement('div');

    if (i < 10) {
      halfHourA.textContent = '0' + i + ':00';
      halfHourB.textContent = '0' + i + ':30';
    } else {
      halfHourA.textContent = i + ':00';
      halfHourB.textContent = i + ':30';
    }

    halfHourA.setAttribute('class', 'halfHours' + zoom * 2);
    halfHourA.setAttribute('id', i + '00');
    // halfHourA.classList.add(i + '00');
    halfHourB.setAttribute('class', 'halfHours' + zoom * 2);
    halfHourB.setAttribute('id', i + '30');
    // halfHourB.classList.add(i + '30');
    document.getElementById('timeDiv').appendChild(halfHourA);
    document.getElementById('timeDiv').appendChild(halfHourB);
  }
}


// Update time marker
let timer = setInterval(updateTimeMarker, 1000);

function updateTimeMarker() {
  let now = new Date();
  let hours = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  // The height of the nowSpan is set to the percentage the passed time represents of the number of minutes in a day
  let nowHeight = zoom * ((hours * 60 + min) * 100 ) / (24*60) + '%';
  if (document.getElementById('nowSpan')) {
    nowSpanElement = document.getElementById('nowSpan');
    nowSpanElement.style.height = nowHeight;
  }

  // if (taskList.length === 2) {
  //   document.getElementById("info").style.animationPlayState = "running";
  // } else {
  //   document.getElementById("info").style.animationPlayState = "paused";
  //   // TODO: Fix hanging border if animation is paused mid cycle
  // }

  updateHearts();

  // Update alarm Toc sound
  let taskAlarms = localStorage.radioButtonResultAlarm;
  if (taskAlarms != 'off') {
    let nowTime = hours.toString() + min.toString() + sec.toString();
    let nowMinusFiveTime = hours.toString() + (min - 5).toString() + sec.toString();
    if (taskAlarms === 'beginning' || taskAlarms === 'both') {
      if (startAndEndTimes.includes('beginning' + nowTime)) {
        sayToc();
      }
    }
    if (taskAlarms === 'end' || taskAlarms === 'both') {
      if (startAndEndTimes.includes('end' + nowMinusFiveTime)) {
        sayTic();
        setTimeout(sayToc, 300);
      }
    }
  }

  // Update reminder Tic sound
  let reminder = localStorage.radioButtonResultReminder;
  if (reminder != 'off') {
    if (reminder === 'regularly') {
      if (min % localStorage.ticInterval === 0 && sec === 0) {
        sayTic();
      }
    }
    if (reminder === 'rand') {
      let randTime = Math.floor(Math.random() * (localStorage.ticInterval - 1) + 1);
      if (min % randTime === 0 && sec === 0) {
        sayTic();
      }
    }
  }
}

function updateHearts() {
  let now = new Date;
  let currentTask = taskList[0];

  // Find the current task and remove old hearts from the display
  for (const [index,  task] of displayList.entries()) {
    if (task.date < now && now < task.end) {
      // Remove old hearts from heart span
      const heartNode = document.getElementById('heart');
      while (heartNode.firstChild) {
        heartNode.removeChild(heartNode.lastChild);
      }

      currentTask = task;
      break;
    }
  }

  let time = (now - currentTask.date) / 60000;
  let result = currentTask.startStressLevel * Math.pow(2, time/(tDouble/currentTask.drain));

  fillHearths(Math.round(10 - result));
}

// TODO: Remove sounds?
function sayToc() {
  let sound = new Audio('429721__fellur__tic-alt.wav');
  sound.play();
}


function sayTic() {
  let sound = new Audio('448081__breviceps__tic-toc-click.wav');
  sound.play();
}

////// Eventlisteners  //////                      // Remember removeEventListener() for anoter time

// document.getElementById('storage').addEventListener('click', function() {goToPage('storage.html');});
document.getElementById('info').addEventListener('click', gotoInfo);
document.getElementById('month').addEventListener('click', monthButtonClicked);

// Unfold settings
document.getElementById('gotoSettings').addEventListener('click', gotoSettings);

document.getElementById('postpone').addEventListener('click', postponeTask);

// Insert a 15 min planning task at start-your-day time according to settings
// document.getElementById('upButton').addEventListener('click', wakeUpButton, {once:true});
document.getElementById('upButton').addEventListener('click', function() {jumpToTime(700, false);});

// Insert a 15 min planning task at the current time
// document.getElementById('nowButton').addEventListener('click', nowButton, {once:true});
document.getElementById('nowButton').addEventListener('click', jumpToNow);

// Makes pressing Enter add task
document.getElementById('dayInputBox').addEventListener('keypress', function () { inputAtEnter(event); });

// Tie event to Clear or Edit button
document.getElementById('clearButton').addEventListener('click', clearTextboxOrDay);

// Tie event to zoom button (⍐ / ⍗). Toggles zoom
document.getElementById('zoom').addEventListener('click', zoomFunc);

// Makes clicking anything inside the taskDiv container run taskHasBeenClicked()
document.getElementById('taskDiv').addEventListener('click', function () { taskHasBeenClicked(event); }, true);

document.getElementById('toDoButton').addEventListener('click', toDoButtonClicked);
////////// Eventlisteners for Add-view   /////////////////////

document.getElementById('addTaskButton').addEventListener('click', addTaskButtonClicked);

document.getElementById('inputBox_add').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readTaskText(); } });
document.getElementById('inputDurationBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readDurationTime(); } });
document.getElementById('inputTimeBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readTaskStartTime(); } });

document.addEventListener('touchmove', function() {twoFingerNavigation(event);});

document.getElementById('duration').addEventListener('click', function () { addDuration(event);});

document.getElementById('time').addEventListener('click', function () { time_add(event);});

document.getElementById('clear').addEventListener('click', clearTimeBox);

document.getElementById('now').addEventListener('click', setTimeNow);

document.getElementById('addInfo').addEventListener('click', gotoInfoStress);

document.getElementById('cancel').addEventListener('click', gotoDayFromAdd);

document.getElementById('apply').addEventListener('click', apply);

////////////////// Eventlisteners for Month-view ///////////////////////

document.getElementById('track').addEventListener('click', trackButtonClicked);

document.getElementById('monthInputBox').addEventListener('keypress', function () { monthInputAtEnter(event); });

document.getElementById('monthTaskDiv').addEventListener('click', function () { monthTaskHasBeenClicked(event); }, true);

document.getElementById('day').addEventListener('click', gotoDay);

document.getElementById('monthClearButton').addEventListener('click', monthClearBehavior);

document.getElementById('moveToDay').addEventListener('click', moveToDay);

document.getElementById('putBack').addEventListener('click', putBack);

////////////////// Eventlisteners for Month-view ///////////////////////

document.getElementById('month1').addEventListener('click', returnToMonth);

////////////////// Eventlisteners for track-view ///////////////////////

document.getElementById('colourButtons').addEventListener('click', function () { colourButtonClicked(event);});

document.getElementById('colourPickerInputBox').addEventListener('focus', function () {
  document.getElementById('colourButtons').hidden = false;
});

document.getElementById('taskPickerInputBox').addEventListener('keypress', function () { taskPickerEvent(event); });

document.getElementById('colourPickerInputBox').addEventListener('keypress', function () { colourPickerEvent(event); });

document.getElementById('deleteTrackedButton').addEventListener('click', removeTracking);

////////////////// Eventlisteners for storage-view ///////////////////////

document.getElementById('storage').addEventListener('click', storageButtonClicked);

document.getElementById('day1').addEventListener('click', gotoDayFromStorage);

document.getElementById('storeList').addEventListener('click', storeList);

document.getElementById('stores').addEventListener('click', function () { storeHasBeenClicked(event); }, true);

////////////////// Eventlisteners for settings-view ///////////////////////

document.getElementById('gotoDayFromSettings').addEventListener('click', gotoDayFromSettings);
document.getElementById('gotoDayFromSettings1').addEventListener('click', gotoDayFromSettings);

document.getElementById('eng').addEventListener('click', checkEnglishRadio)
document.getElementById('dan').addEventListener('click', checkDanishRadio)

document.getElementById('apply0').addEventListener('click', applyLanguage);

document.getElementById('apply1').addEventListener('click', applyTaskDuration);

document.getElementById('apply2').addEventListener('click', applyToc);

document.getElementById('settingsInfo').addEventListener('click', gotoInfoStress);

document.getElementById('apply3').addEventListener('click', applyStressModel);

document.getElementById('clearAllData').addEventListener('click', clearAllData);
document.getElementById('clearEverything').addEventListener('click', clearEverything);

document.getElementById('inputBoxM').addEventListener('focus', inputBoxMGotFocus);
document.getElementById('inputBoxX').addEventListener('focus', inputBoxXGotFocus);
document.getElementById('stressLevel').addEventListener('focus', stressLevelGotFocus);
document.getElementById('tDouble').addEventListener('focus', tDoubleGotFocus);

//////////////////// Add-view code below ///////////////////////////

function addTaskButtonClicked() {
  storeLocally();

  // TODO: Hmmm. Using .hidden removes transition. Get rid of transition CSS or .hidden?
  // Trigger animation via CSS
  // document.getElementById('addView').classList.add('active');
  // document.getElementById('dayView').classList.remove('active');
  document.getElementById('addView').hidden = false;
  document.getElementById('dayView').hidden = true;

  fillDurationBox(defaultTaskDuration);

  clearTimeBox();

  document.getElementById('d1').checked = 'checked';
  // document.getElementById('apply').textContent = 'Ok (then tap where this task should be)';

  let inputBox = document.getElementById('dayInputBox');         // Day-inputBox
  let inputBox_add = document.getElementById('inputBox_add'); // Add-inputBox

  if (inputBox.value != '') {  // Parse the value and fill relevant boxes
    parsedList = parseText(inputBox.value); // parsedList = [taskStart, duration, text, drain];
    inputBox_add.value = parsedList[2];
    inputBox_add.blur();
    fillDurationBox(parsedList[1] / 60000);
    if (parsedList[0] != '') {  // This will never trigger because fixed times are currently stripped when double clicking a task to edit
      fillTimeBox(parsedList[0]);
    }
    let drain = Number(parsedList[3]);
      document.getElementsByClassName('drain')[5 - drain].checked = true;
      if (0 < drain) {
    } else {
      document.getElementsByClassName('drain')[4 - drain].checked = true;
    }

  } else {
    inputBox_add.value = '';
    inputBox_add.focus();
  }
}

function addDuration(event) {
  let btnId = event.target.id;  // btnId is in the form 'durationPlus30m'

  if (btnId === 'inputDurationBox') {
    // Do fuckall
  } else {

    let deltaTime = 0;

    if (btnId.includes('Minus')) {
      btnId = btnId.replace('durationMinus', '');
      btnId = btnId.replace('m', '');
      deltaTime = -Number(btnId);
    } else {
      btnId = btnId.replace('durationPlus', '');
      btnId = btnId.replace('m', '');
      deltaTime = Number(btnId);
    }

    taskDuration_add = Number(taskDuration_add) + deltaTime;
    if (taskDuration_add < 0) {
      taskDuration_add = 0;
    }
    fillDurationBox(taskDuration_add);
  }
}


function fillDurationBox(duration) {
  let hours = 0;
  let minutes = 0;

  hours = (duration - (duration % 60)) / 60;
  minutes = duration - hours * 60;

  let formattedDuration = hours + 'h' + minutes + 'm';
  taskDuration_add = duration;

  document.getElementById('inputDurationBox').value = formattedDuration;
}


function time_add(event) {
  let btnId = event.target.id;  // btnId is in the form 'timePlus30m'

  if (btnId === 'now') {
    taskTime_add = new Date();
    fillTimeBox(taskTime_add);
  } else if (btnId === 'clear') {
    document.getElementById('inputTimeBox').value = '';
    let applyButton = document.getElementById('apply');
    applyButton.textContent = languagePack['applyButtonText'][language][0];
    applyButton.title = languagePack['applyButtonText'][language][1];
  } else if (btnId === 'inputTimeBox') {
    // Do fuckall
  } else {
    let deltaTime = 0;

    if (btnId.includes('Minus')) {
      btnId = btnId.replace('timeMinus', '');
      btnId = btnId.replace('m', '');
      deltaTime = -Number(btnId);
    } else {
      btnId = btnId.replace('timePlus', '');
      btnId = btnId.replace('m', '');
      deltaTime = Number(btnId);
    }

    taskTime_add = new Date(taskTime_add.getTime() + deltaTime * 60000);
    // Ensure that the time is between 00:00 and 23:59
    if (taskTime_add.getDate() < (new Date).getDate()) {
      taskTime_add = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 00, 01);
    } else if ((new Date()).getDate() < taskTime_add.getDate()) {
      taskTime_add = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59);
    }

    fillTimeBox(taskTime_add);
  }

}


function fillTimeBox(time) {  // time in Date-format
  let prettyTaskTime = prettifyTime(time);

  document.getElementById('inputTimeBox').value = prettyTaskTime;

  document.getElementById('apply').textContent = 'Ok'; // Remove instruction from return-button as the task will be added the right place automatically
}


function setTimeNow() {
  taskTime_add = new Date();
  fillTimeBox(taskTime_add);
}


function clearTimeBox() {
  document.getElementById('inputTimeBox').value = '';
  document.getElementById('apply').textContent = languagePack['applyButtonText'][language][0];
  taskTime_add = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 00);
}


function prettifyTime(time) {
  let taskTimeHours = time.getHours().toString();
  let taskTimeMinutes = time.getMinutes().toString();

  // Check if leading zeroes are needed and add them
  let nils = ['', ''];
  if (taskTimeHours < 10) {
    nils[0] = '0';
  }
  if (taskTimeMinutes < 10) {
    nils[1] = '0';
  }
  let prettyTaskTime = nils[0] + taskTimeHours + ':' + nils[1] + taskTimeMinutes;

  return prettyTaskTime
}


function readTaskText() {
  let contentInputBox = document.getElementById('inputBox_add').value.trim();
  let badCharacters = /[^a-zA-ZæøåÆØÅ\s\.\,\?\!\(\)\"]+/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage(languagePack['dontUse'][language][0] + badCharacters + languagePack['dontUse'][language][1], 3000, 'add');
  } else {
    taskText_add = contentInputBox;
  }
}


function readDurationTime() {
  let contentInputBox = document.getElementById('inputDurationBox').value.trim();
  let badCharacters = /[^0-9hm]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage(languagePack['format1h30m'][language], 3000, 'add');
  } else {
    let timeH = 0;
    let timeM = /\d{1,4}m?$/.exec(contentInputBox).toString(); // TODO: Check if numbers are too big
    timeM = Number(timeM.replace('m', ''));
    if (/h/.exec(contentInputBox)) {
      timeH = /[0-9]+h/.exec(contentInputBox).toString();
      contentInputBox = contentInputBox.replace(timeH, '');
      timeH = Number(timeH.replace('h', ''));
    }
    taskDuration_add = timeH * 60 + timeM;
  }
}


function readTaskStartTime() {
  let contentInputBox = document.getElementById('inputTimeBox').value.trim();
  let badCharacters = /[^0-9:]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage(languagePack['format1200'][language], 3000, 'day');
  } else {
    let timeH = /[0-9][0-9]/.exec(contentInputBox);
    contentInputBox = contentInputBox.replace(timeH, '');
    let timeM = /[0-9][0-9]/.exec(contentInputBox);
    let now = new Date();
    taskTime_add = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM);
    if (0 < timeH || 0 < timeM) {
      fillTimeBox(taskTime_add);
      return taskTime_add
    }
  }
}


function readDrainGainRadioButtons() {
  let radioButtonResult = document.getElementsByClassName('drain');
  for (var i = 0; i < 10; i++) {
    if (radioButtonResult[i].type === 'radio' && radioButtonResult[i].checked) {
      drainGainLevel_add = radioButtonResult[i].value;
    }
  }
}


function formatTask() {
  let returnText = '';
  if (document.getElementById('inputTimeBox').value.trim() === '') {
    returnText =  taskText_add + ' '
                + taskDuration_add + 'm '
                + drainGainLevel_add;
  } else {
    let prettyTaskTime = prettifyTime(taskTime_add);
    returnText =  taskText_add + ' '
                + prettyTaskTime.replace(':', '') + ' '
                + taskDuration_add + 'm '
                + drainGainLevel_add;
  }
  return returnText;
}


function apply() {
  let taskText = document.getElementById('inputBox_add');
  if (taskText === '') {
    displayMessage(languagePack['taskTextMsg'][language], 3000, 'day');
  } else {
    readTaskText()
    readDurationTime();
    let startTime = readTaskStartTime();
    readDrainGainRadioButtons();
    returnText = formatTask();
    if (startTime) {
      inputFixedTask(returnText);
    } else {
      document.getElementById('dayInputBox').value = returnText;
    }

    // Close add-view
    document.getElementById('addView').hidden = true;
    document.getElementById('dayView').hidden = false;
  }
}

function gotoDayFromAdd() {
  document.getElementById('addView').hidden = true;
  document.getElementById('dayView').hidden = false;
}

//////////////////// Add-view button code above ///////////////////////////


//////////////////// Month-view code below ///////////////////////////

function monthButtonClicked() {
  storeLocally();

  // Trigger animation via CSS
  // document.getElementById('monthView').classList.add('active');
  // document.getElementById('dayView').classList.remove('active');
  document.getElementById('monthView').hidden = false;
  document.getElementById('dayView').hidden = true;

  fillMonthDateBar();

  monthRenderTasks();

  if (0 < tasksSentBetween.length) {
    fillChooseBox('month');
  }

  // resetInputBox('day');
  document.getElementById('monthInputBox').focus();
}


function gotoDay() {
  // Trigger animation via CSS
  // document.getElementById('monthView').classList.remove('active');
  // document.getElementById('dayView').classList.add('active');
  document.getElementById('monthView').hidden = true;
  document.getElementById('dayView').hidden = false;

  fillChooseBox('day');
}


function fillMonthDateBar() {
  // Remove old content
  while (monthTaskDiv.firstChild) {
    let monthTaskDiv = document.getElementById('monthTaskDiv');
    monthTaskDiv.removeChild(monthTaskDiv.lastChild)
  }


  let now = new Date();
  let nowMinus3Month = new Date();
  nowMinus3Month = new Date(nowMinus3Month.setMonth(nowMinus3Month.getMonth() - 1));
  let nowPlus3Month = new Date();
  nowPlus3Month = new Date(nowPlus3Month.setMonth(nowPlus3Month.getMonth() + 3));
  // TODO: Set scrollheight for monthView
  // TODO: Set number of days shown based on data in pastDaylist?
  let thisMonth = now.getMonth();

  for (let i = nowMinus3Month; i < nowPlus3Month; i.setDate(i.getDate() + 1)) {
    // Insert monthnames before each the 1th
    if (thisMonth < i.getMonth() || (thisMonth === 11 && i.getMonth() === 0)) {  // Month 0 is january
      thisMonth = i.getMonth();
      monthNameNode = document.createElement('button');
      monthNameNode.classList.add('monthName');
      monthNameNode.textContent = months[i.getMonth()];
      monthTaskDiv.appendChild(monthNameNode);
    }

    let newNode = document.createElement('button');

    let id = i.getDate().toString() + '-' + i.getMonth().toString()  + '-' + i.getFullYear().toString();

    newNode.setAttribute('id', id);
    newNode.setAttribute('class', 'isNotClicked');

    newNode.classList.add('dateButton'); // Add to all dateButtons

    if (i < now) {  // For styling purposes. // TODO: Make styling
      newNode.classList.add('pastDateButton');
    } else if (i.getMonth() == now.getMonth() && i.getDate() == now.getDate()) {
      newNode.classList.add('todayButton');
    }


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

    monthTaskDiv.appendChild(newNode);
  }
}


function monthTaskHasBeenClicked(event) {
  let myId = event.target.id;
  if (myId === '') {
    myId = event.target.closest('button').id;
  }

  let day =  document.getElementById(myId);

  if (day.classList.contains('pastDateButton')) {
    displayMessage(languagePack['noPastDates'][language], 3000, 'month');
    return
  } else if (day.classList.contains('todayButton')) {
    displayMessage(languagePack['useDayView'][language], 3000, 'month');
    return
  }

  let contentInputBox = document.getElementById('monthInputBox').value.trim();

  if (contentInputBox != '' && day.classList.contains('isNotClicked')) {
    // Text in inputBox and no previous clicked date
    if (contentInputBox != '') {
      let now = new Date();
      let clickedDate = new Date(now.getFullYear(), /\d+$/.exec(myId), /\d+/.exec(myId) , 12, 00)

      let task = new Task(clickedDate, 15 * 60000, contentInputBox[0].toUpperCase() + contentInputBox.slice(1), 1);

      if (monthTaskList[myId]) {
        monthTaskList[myId].push(task);
      } else {
        monthTaskList[myId] = [task];
      }

      if (document.getElementById('monthChooseBox').classList.contains('active')) {
        if (tasksFromClickedDayInMonth) {
          tasksFromClickedDayInMonth.shift();  // Removes task from list of tasks being handled in chooseBox in order to make putBack() function as expected
        } // tasksSentBetween does not need this shift. I think. As it behaves as expected for now.
      }

      resetInputBox('month');

      // handleChoosebox('month'); // Now in resetInputBox
    }

    monthRenderTasks();

  } else if (contentInputBox != '' && day.classList.contains('isClicked')) {
    // Text in inputBox and a clicked date. Should not happen.
    console.log('Text in inputBox and a clicked date. Should not happen.');
    day.setAttribute('class', 'isNotClicked');

    // No text in inputBox and a clicked date. Effectively a doubleclick
  } else if (contentInputBox === '' && day.classList.contains('isClicked')) {
    if (document.getElementById('monthChooseBox').classList.contains('active')) {
      displayMessage(languagePack['finishTaskFirst'][language], 3000, 'month');
    } else {
      putBackId = myId;

      let dayChildren = day.children;

      if (monthTaskList[myId]) {
        tasksFromClickedDayInMonth = monthTaskList[myId];
        delete monthTaskList[myId];
        dayChildren[2].textContent = '';
        dayChildren[1].innerHTML = '';

        fillChooseBox('month');
      }
    }
    day.classList.add('isNotClicked');
    day.classList.remove('isClicked');

  } else {
    // No text in inputBox and no clicked date
    day.classList.remove('isNotClicked');
    day.classList.add('isClicked');
  }
}


function monthInputAtEnter(event) {
  if (event.key === 'Enter') {
    let contentInputBox = document.getElementById('monthInputBox').value.trim();
    if (contentInputBox != '') {

      // Check if date is provided in the form 7/11
      let dateArray = /\d+\/\d+/.exec(contentInputBox);

      if ( dateArray != null ) {
        // Is it a legit date?
        if ( (/\d+\//.exec(dateArray[0])[0].replace('\/', '') <= 31 &&
          /\/\d+/.exec(dateArray[0])[0].replace('\/', '') <= 12)) {

            // Make myId from date
            let month = (/\d+\//.exec(dateArray[0])[0].replace('\/', '')).toString();
            let day = (Number(/\/\d+/.exec(dateArray[0])[0].replace('\/', '')) - 1).toString();
            let now = new Date();
            let myId = day + month + now.getFullYear();

            let textInputBox = contentInputBox.replace(dateArray[0], '').trim();

            if (textInputBox === '') {
              gotoDate(myId); // TODO: Make gotoDate() (yank it from month.js?) and sanitize input
            } else {
              // Insert a new task at the provided date
              let now = new Date();
              let taskStart = new Date(now.getFullYear(), month, day, 12, 0);
              let task = new Task(taskStart, 15 * 60000, textInputBox[0].toUpperCase() + textInputBox.slice(1), 1);

              if (monthTaskList[myId]) {
                monthTaskList[myId].push(task);
              } else {
                monthTaskList[myId] = [task];
              }
            }

        } else {
          displayMessage(languagePack['notADate'][language], 4000, 'month');
          return;
        }

      // If no date is included make a new task tomorrow
      } else {
        let now = new Date();
        let nowPlusOneDay = new Date();
        nowPlusOneDay = new Date(nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1));

        let myId = nowPlusOneDay.getDate().toString() + '-' + nowPlusOneDay.getMonth().toString() + '-' + nowPlusOneDay.getFullYear();

        let task = new Task(nowPlusOneDay, 15 * 60000, contentInputBox[0].toUpperCase() + contentInputBox.slice(1), 1);

        if (monthTaskList[myId]) {
          monthTaskList[myId].push(task);
        } else {
          monthTaskList[myId] = [task];
        }
      }

      monthRenderTasks();

      resetInputBox('month');

    }
  }
}


function monthRenderTasks() {

  storeLocally();

  // Remove old text from buttons and tooltips
  const days = document.getElementById('monthTaskDiv').children;
  const len = days.length;
  for (var i = 0; i < len; i++) {
    if (days[i].children.length > 0) {
      days[i].children[2].textContent = '';
      days[i].children[1].innerHTML = '';
    }
  }

  // Fill in and colour days in the past according to taskList for each day
  for (var myId in pastDayList) {
    let tasks = createDisplayList(pastDayList[myId]);

    let gradient = '';
    let taskColour = 'white';

    // Make gradient for the day currently being processed
    for (var n in tasks) {
      // Find the percent needed to be coloured (from startPercent to endPercent)
      startPercent = parseInt((tasks[n].date.getHours() * 60 + tasks[n].date.getMinutes()) / (24 * 60) * 100);
      endPercent = parseInt(startPercent + (tasks[n].duration / 60000) / (24 * 60) * 100);

      if (n == 0) {  // Avoid dayStart, but add white at start of the day
        gradient += 'white ' + parseInt((tasks[1].date.getHours() * 60
        + tasks[1].date.getMinutes()) / (24 * 60) * 100) + '%';
        continue;
      }


      // Find colour value if text is in trackTaskList
      let string = tasks[n].text;
      string = string.replace(/ /g, '_');

      for (var trackedTaskText in trackTaskList) {
        taskColour = '#DED';  // Default task colour if not watched
        if (string == '') {
          taskColour = 'white'; // nullTime is made white
          break;
        } else if (string == trackedTaskText) {
          if (Number(trackTaskList[trackedTaskText][1]) === 1) {
            taskColour = trackTaskList[trackedTaskText][0];
          }
          break;
        }
      }

      gradient += ', ' + taskColour + ' ' + startPercent
      + '%, ' + taskColour + ' ' + Number(endPercent - 0.3)  + '%, '
      + 'black ' + Number(endPercent - 0.3) + '%, black ' + endPercent + '%';

      taskColour = 'white';
    }

    // Find button, set gradient and write to tooltip
    let button = document.getElementById(myId);
    if (button != null) {
      let buttonText = document.getElementById(myId).lastChild;
      button.setAttribute('style', 'background-image: linear-gradient(to right, ' + gradient + ')');
      // Set tool-tip to show the tasks of the day
      let children = button.childNodes;
      let rawTasks = pastDayList[myId];
      if (rawTasks != '') {
        for (var task of rawTasks) {
          if (task.text == 'Day start' || task.text == 'Day end') {
            continue;
          }

          children[1].innerHTML += ' \u25CF ' + task.text + '&nbsp;' + '<br>'; // Write to tooltip
        }
      }
    }
  }

  // Write new text into buttons and tooltips
  for (var myId in monthTaskList) {
    let button = document.getElementById(myId);

    if (button != null) {
      let children = button.childNodes;  // datePart, toolTip and text

      let tasks = monthTaskList[myId];

      if (tasks != '') {
        for (var task of tasks) {
          children[1].innerHTML += ' \u25CF ' + task.text + '&nbsp;' + '<br>'; // Write to tooltip
          children[2].textContent +=  ' \u25CF ' + task.text + '\u00a0'; // Write task to date
        }
      }
    }
  }

  document.getElementById('monthContainer').scrollTop = 500;
}


function putBack() { // TODO: Fix putBack.
  monthTaskList[putBackId] = tasksFromClickedDayInMonth;

  let chooseBox = document.getElementById('monthChooseBox');

  while (chooseBox.firstChild) {
    chooseBox.removeChild(chooseBox.lastChild);
  }

  chooseBox.classList.remove('active');
  document.getElementById('putBack').classList.remove('active');

  monthRenderTasks();

  resetInputBox('month');
}


function monthClearBehavior() {
  if (document.getElementById('monthInputBox').value === '') {
    alert(languagePack['removeAllReminder'][language]);
  } else {
    resetInputBox('month');
  }
}


// Remenber nested functions to limit scope and new debugging tools

//////////////////// Month-view code above ///////////////////////////

//////////////////// Track-view code below ///////////////////////////

function trackButtonClicked() {
  storeLocally();

  document.getElementById('trackView').hidden = false;
  document.getElementById('monthView').hidden = true;

  renderTracking();
}


function renderTracking() {

  storeLocally();

  // Remove old content
  const trackedItemsDiv = document.getElementById('trackedItemsDiv');
  removeContentFrom(trackedItemsDiv);

  const colourButtons = document.getElementById('colourButtons');
  removeContentFrom(colourButtons);

  // Add new content
  // ... to list of tracked tasks
  for (const item in trackTaskList) {
    showTrackedTask(item);
  }
  // ... and to colourButtons (still hidden)
  for (const colour in colours) {
    addColour(colour);
  }
}


function removeContentFrom(div) {  // Used by renderTracking
  while (div.firstChild) {
    div.removeChild(div.lastChild);
  }
}


function addColour(colour) {  // Used by renderTracking
  let colourButtons = document.getElementById('colourButtons');
  let colourButton = document.createElement('button');

  colourButton.style.backgroundColor = colours[colour];
  colourButton.style.fontSize = '0.6em';
  colourButton.textContent = colours[colour];
  colourButton.id = colours[colour];
  colourButton.classList.add('colourButton');

  document.getElementById('colourButtons');
  colourButtons.appendChild(colourButton);
}


function taskPickerEvent(event) {
  if (event.key === 'Enter') {
    addTrackedTask(null);
  }
}


function colourPickerEvent(event) {
  if (event.key === 'Enter') {
    addTrackedTask(null);
  }

}


function colourButtonClicked(event) {
  let chosenColour = event.target.id;
  addTrackedTask(chosenColour);
}

// TODO: Make clear data in Settings work with nowButton and upButton

function addTrackedTask(buttonColour) {
  // TODO: Sanitize inputs
  let taskPickerInputBox = document.getElementById('taskPickerInputBox');
  let text = taskPickerInputBox.value.trim();
  if (/^[^'!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']+$/.exec(text)) {
    taskPickerInputBox.value = '';

    let colourPickerInputBox = document.getElementById('colourPickerInputBox');

    if (colourPickerInputBox.value.trim() != '') {  // If there is text in the coulorPicker input box...
      chosenColour = colourPickerInputBox.value.trim();
    } else if (buttonColour === null) { // If no button has been clicked and no text: assign random colour not already used...
      let tryAgain = false;
      do {
        tryAgain = false;
        chosenColour = colours[Math.floor(Math.random()*40)];
        for (var key in trackTaskList) {
          if (trackTaskList[key][0] === chosenColour) {
            tryAgain = true;
            break;
          }
        }
      }
      while (tryAgain)

    } else { // If a colourButton has been clicked...
      chosenColour = buttonColour;
    }

    colourPickerInputBox.value = '';

    // document.getElementById('chosenColour').style.backgroundColor = chosenColour;
    document.getElementById('colourButtons').hidden = true;

    text = text.replace(/ /g, '_');  // The DOM can't handle spaces
    text = text.charAt(0).toUpperCase() + text.slice(1);
    trackTaskList[text] = [chosenColour, '1'];
    renderTracking();
  } else if (text != '') {
    alert(languagePack['onlyAlphaNumerics'][language]);
    return;
  } else {
    displayMessage(languagePack['addATask'][language], 3000, 'track');
  }
}

function removeTracking() {
  let answer = confirm(languagePack['removeUnchecked?'][language]);
  if (answer) {
    for (const key in trackTaskList) {
      if (trackTaskList[key][1] === '0.25') {
        delete trackTaskList[key];
      }
    }
    renderTracking();
  } else {
    displayMessage(languagePack['nothingChanged'][language], 3000, 'track');
  }
}


function trackCheckboxClicked(event) {
  let trackedTask = event.target.id;
  let element = document.getElementsByClassName(trackedTask);
  // TODO: Add functionality aside greying out line

  // Set opacity according to checked status
  if (event.target.checked) {
    trackTaskList[trackedTask][1] = "1";
    element[0].style.opacity = 1;
    element[1].style.opacity = 1;
  } else {
    trackTaskList[trackedTask][1] = "0.25";
    element[0].style.opacity = 0.25;
    element[1].style.opacity = 0.25;
  }
}


function showTrackedTask(item) {  // Opacity is 1 for tracked items and 0.25 for suspended items
  let trackedItem = document.createElement('span');

  // Create checkbox
  let trackedItemCheckBox = document.createElement('input');
  trackedItemCheckBox.type = 'checkbox';
  trackedItemCheckBox.name = item;
  trackedItemCheckBox.id = item;

  if (Number(trackTaskList[item][1]) === 1) {  // trackTaskList opacity determine if line is shown or greyed out
    trackedItemCheckBox.checked = true;
  } else {
    trackedItemCheckBox.checked = false;
  }
  // trackedItemCheckBox.style.gridArea = '1 / 0';

  trackedItem.appendChild(trackedItemCheckBox);

  // Create spacer
  trackedItemSpacer = document.createElement('span');
  trackedItemSpacer.textContent = '\u00a0\u00a0';

  trackedItem.appendChild(trackedItemSpacer);

  // Create colour
  trackedItemColour = document.createElement('span');
  trackedItemColour.classList.add(item);
  trackedItemColour.style.backgroundColor = trackTaskList[item][0];
  trackedItemColour.textContent = '\u00a0\u00a0\u00a0\u00a0';
  trackedItemColour.style.opacity = trackTaskList[item][1];
  // trackedItemColour.style.gridArea = '1 / 0';

  trackedItem.appendChild(trackedItemColour);

  // Create text
  trackedItemButton = document.createElement('span');
  trackedItemButton.classList.add(item);
  let text = item.replace(/_/g, ' ');
  trackedItemButton.textContent = '\u00a0\u00a0\u00a0' + text.charAt(0).toUpperCase() + text.slice(1);
  trackedItemButton.style.opacity = trackTaskList[item][1];
  // trackedItemButton.style.gridArea = '1 / 0';

  trackedItem.appendChild(trackedItemButton);

  // TODO: Make colours match up with text - by moving Create Colour up to the top?
  document.getElementById('trackedItemsDiv').appendChild(trackedItem);
  // document.getElementById('trackedItemsColourDiv').appendChild(trackedItemColour);

  document.getElementById(item).addEventListener('click', function () { trackCheckboxClicked(event); });
}


function returnToMonth() {
  document.getElementById('trackView').hidden = true;
  document.getElementById('monthView').hidden = false;
  monthRenderTasks();
}


//////////////////// Track-view code above ^^^ ///////////////////////////

//////////////////// Storage-view code below ///////////////////////////


function storageButtonClicked() {
  storeLocally();

  document.getElementById('dayView').hidden = true;
  document.getElementById('storageView').hidden = false;

  let storages = document.getElementsByClassName('store');

  for (var index in storages){
    if (language === 0) {  // Value 0:English 1:Danish
      storages[index].innerText = weekDays[index];
    } else if (language === 1) {
      storages[index].innerText = ugeDage[index];
    }
  }

  for (var memoryCell in storageList) {
    let node = document.getElementById(memoryCell);
    node.classList.remove('highLighted');
    node.textContent = storageList[memoryCell][1];
    if (memoryCell) {
      node.classList.add('inUse');
      node.classList.remove('notInUse');
    }
  }
}


function storeList() {
  let storeButtons = document.getElementsByClassName('store');
  for (const button of storeButtons) {
    if (/\d/.exec(button.id)) { // Only buttons with a number in their id gets highlighted
      button.classList.add('highLighted');
    }
  }
}


function storeHasBeenClicked(event) {
  let id = event.target.id;
  let text = '';

  if (id != '') {
    let clickedButton = document.getElementById(id);
    if (id === 'trashBin') {
    // Restore stuff from trashBin
      if (storageList['trashBin']) {
        let trash = deepCopyFunc(storageList['trashBin'][0]);  // Retrieve content of trashBin
        if (2<taskList.length) {
          storageList['trashBin'] = [deepCopyFunc(taskList), 'Restore last discarded task list'];   // Put current taskList into the trashBin
        }
        // taskList = fixDatesInList(trash);  // Restore trash as taskList
        taskList = trash;  // Restore trash as taskList
        document.getElementById('trashBin').classList.add('inUse');
        document.getElementById('trashBin').classList.remove('notInUse');
        gotoDayFromStorage();
      } else {
        displayMessage(languagePack['nothingIsDiscarded'][language], 3000, 'storage');
      }
    // If a store is clicked...
    // Store current day if clicked store not in use
    } else if (clickedButton.classList.contains('highLighted')) {
      if (clickedButton.classList.contains('notInUse')) {
        clickedButton.classList.remove('notInUse');
        clickedButton.classList.add('inUse');
      }

      text = prompt(languagePack['changeLabel?'][language], clickedButton.innerText);

      if (text === '' || text === null) {
        storageList[id] = [taskList, clickedButton.innerText];
      }
      else if (/^[^'!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']+$/.exec(text)) { // Sanitize input: only alpha numericals
        text = text.slice(0, 1).toUpperCase() + text.slice(1, );
        clickedButton.innerText = text;
        storageList[id] = [taskList, text];
      } else if (text != '') {
        alert(languagePack['onlyAlphaNumerics'][language]);
        return;
      }
      // Store stuff
      if (taskList.length === 2) {  // If taskList is empty except for dayStart and dayEnd...
        clickedButton.classList.remove('inUse');
        clickedButton.classList.add('notInUse');
        if (language === 0) {  // Value 0:English 1:Danish
          clickedButton.innerText = weekDays[/\d+/.exec(clickedButton.id) - 1];
        } else if (language === 1) {
          clickedButton.innerText = ugeDage[/\d+/.exec(clickedButton.id) - 1];
        }
        delete storageList[clickedButton.id];
        displayMessage(languagePack['listCleared'][language], 3000, 'storage');
      } else {
        displayMessage(languagePack['listStoredIn'][language] + clickedButton.innerText, 3000, 'storage');
      }
      setTimeout(function() {gotoDayFromStorage();}, 3500);

      // ... else get stuff
    } else if (clickedButton.classList.contains('inUse')) {
      storageList['trashBin'] = [deepCopyFunc(taskList), languagePack['restoreLast'][language]]; // Move current tasklist to trash bin
      taskList = fixDatesInList(storageList[clickedButton.id][0]); // Let current tasklist be chosen stored tasklist - after dates are fixed...
      document.getElementById('trashBin').classList.add('inUse');
      document.getElementById('trashBin').classList.remove('notInUse');
      displayMessage(languagePack['retrieveFrom'][language][0] + clickedButton.innerText + languagePack['retrieveFrom'][language][1], 3000, 'storage');
      setTimeout(function() {gotoDayFromStorage();}, 3500); // timeout necessary for displayMessage to finish
    } else {
      displayMessage(languagePack['storeIsEmpty'][language], 3000, 'storage');
    }

    // Remove highlights
    let storeButtons = document.getElementsByClassName('store');
    for (const button of storeButtons) {
      if (/\d/.exec(button.id)) { // Only buttons with a number in their id gets highlighted
        button.classList.remove('highLighted');
      }
    }
  }

}

function gotoDayFromStorage() {
  storeLocally();
  document.getElementById('storageView').hidden = true;
  document.getElementById('dayView').hidden = false;
  renderTasks();
}

//////////////////// Storage-view code above ^^^ ///////////////////////////

//////////////////// Settings-view code below ///////////////////////////

// Used by an eventListener. Display settings.
function gotoSettings() {
  // goToPage('settings.html')
  // Ligth/Dark theme?
  storeLocally();

  setUpSettings();

  document.getElementById('dayView').hidden = true;
  document.getElementById('settingsView').hidden = false;
}


function setUpSettings() {
  if (language === 0) {  // Value 0:English 1:Danish {
    document.getElementById('en').checked = true;
  } else if (language === 1) {
    document.getElementById('da').checked = true;
  }

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


function stressLevelGotFocus() {
  document.getElementById('stressLevel').select();
}

function tDoubleGotFocus() {
  document.getElementById('tDouble').select();
}


function checkEnglishRadio() {
  document.getElementById('en').checked = true;
}


function checkDanishRadio() {
  document.getElementById('da').checked = true;
}


function applyLanguage() {
  radioButtonResult0 = document.getElementsByClassName('language');
  for (var i=0; i<2; i++) {
    if (radioButtonResult0[i].type === 'radio' && radioButtonResult0[i].checked) {
      language = Number(radioButtonResult0[i].value);  // Value 0:English 1:Danish
      localStorage.language = language;
    }
  }
  renderLanguage();

  gotoDayFromSettings();
}


function applyTaskDuration() {

  let min = document.getElementById('inputBoxM').value.trim();

  if (isNaN(min) || min < 0 || 24*60 - 2 < min) { // TODO: Scroll to top or display message
    displayMessage(languagePack['only0-1438'][language], 3000, 'settings');
    document.getElementById('inputBoxM').select();
    return;
  }

  defaultTaskDuration = min;
  localStorage.defaultTaskDuration = defaultTaskDuration;

   gotoDayFromSettings();
  // window.location.assign('main.html');
}


function applyToc() {
  let min = document.getElementById('inputBoxX').value.trim();

  if (isNaN(min) || min < 0 || 59 < min) {
    displayMessage(languagePack['only0-59'][language], 3000, 'settings');
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

   gotoDayFromSettings();
   // window.location.assign('main.html');
}


function applyStressModel() {
  // Set wakeup stress level
  let value = document.getElementById('stressLevel').value.trim();
  if (isNaN(value) || value < 0 || 5 < value) {
    displayMessage(languagePack['only0-5'][language], 3000, 'settings');
    document.getElementById('stressLevel').select();
    return;
  } else {
    wakeUpStress = value;
    localStorage.wakeUpStress = wakeUpStress;
  }

  // Set tDouble
  let min = document.getElementById('tDouble').value.trim();
  if (isNaN(min) || min < 0 || 24*60 < min) {
    displayMessage(languagePack['only0-1438'][language], 3000, 'settings');
    document.getElementById('stressLevel').select();
    return;
  } else {
    tDouble = min;
    localStorage.tDouble = tDouble;
  }

  gotoDayFromSettings();
}

function clearAllData() {
  let answer = confirm(languagePack['sureYouWannaClear?'][language])
  if (answer) {
    taskList = [];
    localStorage.taskList = [];
    localStorage.monthTaskList = [];
    localStorage.pastDayList = [];
    clearDay();
    location.reload(true);
  } else {
    alert(languagePack['nothingWasDeleted'][language]);
  }
}


function clearEverything() {
  let answer = confirm(languagePack['reallySure?'][language]);
  if (answer) {
    localStorage.clear();
    location.reload(true);
  } else {
    alert(languagePack['nothingWasDeleted'][language]);
  }
}


function gotoDayFromSettings() {
  storeLocally();
  document.getElementById('settingsView').hidden = true;
  document.getElementById('dayView').hidden = false;
  renderTasks();
}

//////////////////// Settings-view code above ^^^ ///////////////////////////

function twoFingerNavigation(event) {
  if (sessionStorage.touchX && event.touches.length === 1) {
    sessionStorage.touchX = '';
  }
  if (event.touches.length > 1) {
    if (!sessionStorage.touchX) {
      sessionStorage.touchX = event.touches[0].screenX; // SESSIONstorage, not localStorage. Doh.
    } else if (event.touches[0].screenX - sessionStorage.touchX < 50) { // Left swipe
      goToPage('storage.html');
    } else if (event.touches[0].screenX - sessionStorage.touchX > 50) { // Right swipe
      goToPage('month.html'); // TODO: Fix twofingerNavigation
    }
  }
}

function  fillHearths(currentStressLevel) {
  const heartSpan = document.getElementById('heart');

  let max = currentStressLevel;
  if (max < 0) {
    max = 0;
  }
  if (10 < max) {
    max = 10;
  }

  for (var i = 0; i < max; i++) {
    let newHeart = document.createElement('img');
    newHeart.src="200px-A_SVG_semicircle_heart.svg.png";
    newHeart.style.width = '14px';
    newHeart.style.height = '14px';
    newHeart.style.alt="heart symbol";

    heartSpan.appendChild(newHeart);
  }

  for (var i = 0; i < 10 - max; i++) {
    let newHalfHeart = document.createElement('img');
    newHalfHeart.src="200px-A_SVG_semicircle_heart_empty.svg.png";
    newHalfHeart.style.width = '14px';
    newHalfHeart.style.height = '14px';
    newHalfHeart.style.alt="empty heart symbol";

    heartSpan.appendChild(newHalfHeart);
  }
}


function gotoInfo() {
  if (language === 0) {  // Value 0:English 1:Danish {
    goToPage('instructions.html');
  } else if (language === 1) {
    goToPage('instructions_dk.html');
  }
}

 function gotoInfoStress() {
   if (language === 0) {  // Value 0:English 1:Danish {
     goToPage('instructions.html#stressModel');
   } else if (language === 1) {
     goToPage('instructions_dk.html#stressModel');
   }
 }

function goToPage(page) {
  storeLocally();

  window.location.assign(page);
}


// Used by an eventListener. Inserts a 15 min planning task at the start of your day
function wakeUpButton() {
  let succes = false;
  let now = new Date();
  let taskStartMinusDst = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeUpH, wakeUpM);
  let taskStart = new Date(taskStartMinusDst.getTime() + 0 * dstOffset); // TODO: Remove dstOffset?
  let task = new Task(taskStart, 15 * 60000, 'Planning', 1);
  succes = addFixedTask(task);
  if (!succes) {
    console.log('wakeUpButton failed to insert a task');
  }
  document.getElementById('nowButton').removeEventListener('click', nowButton, {once:true});
  wakeUpOrNowClickedOnce = true;
  adjustNowAndWakeUpButtons();
}


// Used by an eventListener. Inserts a 15 min planning task at the current time
function nowButton() {
  let task = new Task(new Date(), 15 * 60000, 'Planning', 1);
  addFixedTask(task);
  document.getElementById('upButton').removeEventListener('click', wakeUpButton, {once:true});
  wakeUpOrNowClickedOnce = true;
  adjustNowAndWakeUpButtons();
}


function adjustNowAndWakeUpButtons() {
  let min = '';
  // let upBtn = document.getElementById('upButton');
  // let nowBtn = document.getElementById('nowButton');
  let upBtn = document.getElementById('upButton');
  let nowBtn = document.getElementById('nowButton');

  if (parseInt(wakeUpM) <= 9) { // Adjust minutes to two digits always
    min = '0' + parseInt(wakeUpM);
  } else {
    min = parseInt(wakeUpM);
  }

  if (!wakeUpOrNowClickedOnce) {
    upBtn.title=  languagePack['upButtonRegular'][language][1] + wakeUpH + ':' + min;
    upBtn.textContent = wakeUpH + ':' + min + languagePack['upButtonRegular'][language][0] ; //' \u25BE';  // Black down-pointing small triangle

    nowBtn.title = languagePack['nowButton'][language][1]; // 'Click to insert a 15 min planning period at current time';
    nowBtn.textContent = languagePack['nowButton'][language][0]; // 'Now' + ' \u25BE';  // Black down-pointing small triangle

    document.getElementById('upButton').addEventListener('click', wakeUpButton, {once:true});
    document.getElementById('nowButton').addEventListener('click', nowButton, {once:true});
    document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
  } else {
    upBtn.title = languagePack['upButtonJump'][language][1] + wakeUpH + ':' + min;  // 'Jumpt to'
    upBtn.textContent = languagePack['upButtonJump'][language][0] + wakeUpH + ':' + min;  // '\u25B8' Black right-pointing small triangle

    nowBtn.title = languagePack['nowButtonJump'][language][1] // 'Jump to now';
    nowBtn.textContent = languagePack['nowButtonJump'][language][0] // '\u25B8' + 'Now';  // Black right-pointing small triangle
  }
  renderTasks();
  document.getElementById('dayInputBox').focus();
}


// Used by an eventListener. Makes pressing Enter add task
function inputAtEnter(event) {
  let button = document.getElementById('clearButton');
  if (event.key === 'Enter') {
    let contentInputBox = document.getElementById('dayInputBox').value.trim();
    if (/[a-c, e-g, i-l, n-z]/.exec(contentInputBox) != null && chosenTaskId === '') {
      inputFixedTask(contentInputBox);
    } else {
      if (/[^0-9]/.exec(contentInputBox) != null && chosenTask != '') { // If there is a chosen task AND text it must be an error
        nullifyClick();
      } else if (/\d[0-5][0-9]/.exec(contentInputBox) != null || /[1-2]\d[0-5][0-9]/.exec(contentInputBox) != null) {
        // If there is 3-4 numbers, jump to the time indicated
        resetInputBox('day');
        jumpToTime(contentInputBox, true);
      } else { // Give up. Something stupid happened.
        displayMessage(languagePack['formatReminder'][language], 6000, 'day')
        resetInputBox('day');
      }
    }
    // // Ready buttons for next task // TODO: Check if ChooseBox is active
    // button.textContent = languagePack['clearButton'][language][0];  // Black down-pointing small triangle
    // button.title = languagePack['clearButton'][language][1];
    fixClearButtonArrow();
    document.getElementById('addTaskButton').textContent = '+';
    document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
  } else {
    // Ready buttons for clearing or editing current text in inputbox
    button.textContent = languagePack['clearButtonText'][language][0]; // Black left-pointing small triangle
    button.title = languagePack['clearButtonText'][language][1];
    document.getElementById('addTaskButton').textContent = '\u270D';  // Writing hand
    document.getElementById('sortTask').setAttribute('class', 'tasksToSort');
  }
}

function inputFixedTask(contentInputBox) {
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
  if (taskList.length == 1 && parsedList[0] == '') {
    displayMessage(languagePack['startWithFixed'][language], 5000, 'day');
  } else {
    let succes = addTask(uniqueIdOfLastTouched, task); // TODO: The unique id changes when jumping between pages...

    if (!succes) {
      displayMessage(languagePack['notEnoughRoom'][language], 3000, 'day');  // TODO: This just drop a new task if there is not room. Oups.
      document.getElementById('dayInputBox').value = contentInputBox;
    }
    renderTasks();
    jumpTo(uniqueIdOfLastTouched)
  }
}

function nullifyClick() {
  let myId = getIndexFromUniqueId(chosenTaskId);
  taskList[myId].isClicked = 'isNotClicked';
  chosenTaskId = '';
}

function addTask(myId, task) {
  let succes = false;
  if (task.date == '') {  // No fixed time ...
    succes = addWhereverAfter(myId, task);
  } else {
    succes = addFixedTask(task);
  }
  resetInputBox('day');
  return succes;
}


function addWhereverAfter(uniqueId, task) {
  let succes = false;
  let myId = getIndexFromUniqueId(uniqueId);
  for (var id=myId; id<taskList.length - 1; id++) {
    succes = addTaskAfter(taskList[id].uniqueId, task);
    looseInputBoxFocus('day');
    if (succes) {
      break;
    }
  }
  return succes;
}


function addTaskAfter(uniqueId, task) {
  let id = getIndexFromUniqueId(uniqueId);
  task.date = taskList[id].end;
  task.end = new Date(task.date.getTime() + task.duration);
  task.fuzzyness = 'isFuzzy';
  if (taskList[id + 1].fuzzyness === 'isFuzzy' || task.end <= taskList[id + 1].date) {
    taskList.splice(id + 1, 0, task);
    uniqueIdOfLastTouched = task.uniqueId;
    looseInputBoxFocus('day');
    anneal();
    return true;
  } else {
    return false;
  }
}


function addTaskBefore(myId, task) {
  let id = getIndexFromUniqueId(myId);
  task.date = new Date(taskList[id].date.getTime() - task.duration);
  task.end = taskList[id].date;
  if (taskList[id].fuzzyness != 'isFuzzy' && taskList[id - 1].end > task.date) {
    displayMessage(languagePack['notEnoughRoom'][language], 3000, 'day');
    return false;
  } else {
    if (taskList[id].fuzzyness === 'isNotFuzzy') {
      task.fuzzyness = 'isNotFuzzy';
    } else {
      task.date = new Date(taskList[id - 1].end);
      task.end = new Date(task.date.getTime() + task.duration);
      task.fuzzyness = 'isFuzzy';
    }
    taskList.splice(id, 0, task);
    uniqueIdOfLastTouched = task.uniqueId;
    looseInputBoxFocus('day');
    anneal();
    return true;
  }
}


function addFixedTask(task) {
  let succes = false;
  let overlap = '';
  let backUpTaskList = [].concat(taskList); // Make a deep copy
  let len = taskList.length;

  overlap = isThereASoftOverlap(task);
  if (overlap === 'hardOverlap') {
    displayMessage(languagePack['overlap'][language], 3000, 'day');
    return false;
  } else if (overlap === 'softOverlap') {
    overlappingTasks = removeFuzzyOverlap(task);
    let id = getIndexFromUniqueId(overlappingTasks[0][0]);
    taskList.splice(id + 1, 0, task);
    task.fuzzyness = 'isNotFuzzy';
    uniqueIdOfLastTouched = task.uniqueId;
    succes = true;
    if (overlappingTasks.length > 0) {
      for (const [index, task] of overlappingTasks.entries()) {
        succes = addWhereverAfter(task[0], task[1]);
      }
    }
  } else if (overlap === 'noOverlap') {
    for (var n=0; n<len; n++) {
      if (task.end < taskList[n].date) {
        taskList.splice(n, 0, task);
        task.fuzzyness = 'isNotFuzzy';
        uniqueIdOfLastTouched = task.uniqueId;
        succes = true;
        break;
        }
      }
  }

  if (!succes) {
    taskList = [].concat(backUpTaskList);
  }
  return succes;
}


function isThereASoftOverlap(task) {
  let overlap = '';
  let len = taskList.length;

  for (var n=0; n<len; n++) {
    if ((taskList[n].date < task.date && task.date < taskList[n].end)
      || (taskList[n].date < task.end && task.end < taskList[n].end)) {
        if (taskList[n].fuzzyness === 'isNotFuzzy') {
          overlap = 'hardOverlap';
          return overlap;
        } else {
          overlap = 'softOverlap';
        }
      }
      if (n === len - 1 && overlap === 'softOverlap') {
        return overlap
      }
  }

  overlap = 'noOverlap';
  return overlap;
}


function removeFuzzyOverlap(task) {
  let overlappingTasks = [];
  let len = taskList.length;
  // debugger;
  for (var n=1; n<len - 1; n++) {
    if ((taskList[n].date < task.date && task.date < taskList[n].end)
    || (taskList[n].date < task.end && task.end < taskList[n].end)) {
      if (taskList[n].fuzzyness === 'isNotFuzzy') {
        console.log('Bugger. Logic broke.', taskList[n]);
      };
      overlappingTasks.push([taskList[n - 1].uniqueId, taskList[n]]);
    }
  }
  for (const [index, overlappingTask] of overlappingTasks.entries()) {
    let uniqueId = overlappingTask[1].uniqueId;
    for (const [index, task] of taskList.entries()) {
      if (uniqueId === task.uniqueId) {
        taskList.splice(index, 1);
      }
    }
  }
  return overlappingTasks
}

// Used by an eventListener. Govern the Edit/Clear button
function clearTextboxOrDay() {
  if (document.getElementById('dayInputBox').value != '' ) {
    fixClearButtonArrow();
  } else { // Clean all tasks from day-view
    let answer = confirm(languagePack['removeAllTasks?'][language]);
    if (answer == true) {
      clearDay();
    } else {
      displayMessage(languagePack['nothingChanged'][language], 3000, 'day');
    }
  }
  resetInputBox('day');
}

function fixClearButtonArrow() {
  let chooseBox = document.getElementById('dayChooseBox');
  let clearButton = document.getElementById('clearButton');

  if (chooseBox.classList.contains('active')) { // If stuff in ChooseBox...
    clearButton.textContent = languagePack['clearButtonText'][language][0]; // Black left-pointing small triangle
    clearButton.title = languagePack['clearButtonText'][language][1];
  } else {
    clearButton.textContent = languagePack['clearButton'][language][0]; // Black down-pointing small triangle
    clearButton.title = languagePack['clearButton'][language][1];
    document.getElementById('addTaskButton').textContent = '+';
    document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
    id = '';
  }
}


function clearDay() {
  // Move current taskList to trashBin
  storageList['trashBin'] = [deepCopyFunc(taskList), languagePack['restoreLast'][language]];
  document.getElementById('trashBin').classList.add('inUse');
  document.getElementById('trashBin').classList.remove('notInUse');

  // Make sure all alternative views are turned off
  resetViews();

  // Clear stuff and reset
  taskList = [];
  uniqueIdList = [];
  makeFirstTasks();
  resetInputBox('day');
  wakeUpOrNowClickedOnce = false;
  localStorage.indexOfLastTouched = 0;
  document.getElementById('upButton').addEventListener('click', wakeUpButton, {once:true});
  document.getElementById('nowButton').addEventListener('click', nowButton, {once:true});
  storeLocally();
  adjustNowAndWakeUpButtons();
  setUpFunc();
  document.getElementById('dayInputBox').value = '';
  document.getElementById('addTaskButton').textContent = '+';
  document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
}


function resetViews() {
  document.getElementById('addView').hidden = true;
  document.getElementById('monthView').hidden = true;
  document.getElementById('trackView').hidden = true;
  document.getElementById('storageView').hidden = true;
  document.getElementById('dayView').hidden = false;
}


function renderLanguage() {
  let buttons = document.getElementsByClassName('controlButton');

  for (var index in buttons){
    let id = buttons[index].id;
    if (languagePack[id]) {
      buttons[index].textContent = languagePack[id][language][0];  // languagePack:  {'id': ['text', 'title']}
      buttons[index].title = languagePack[id][language][1];  // English: 0, Danish: 1
      buttons[index].lang = lang[language];  // lang = ['en', 'da']
    }
  }

  let inputBoxes = document.getElementsByClassName('inputBox');

  for (var index in inputBoxes){
    let id = inputBoxes[index].id;
    if (languagePack[id]) {
      inputBoxes[index].textContent = languagePack[id][language][0];  // languagePack:  {'id': ['text', 'title']}
      inputBoxes[index].title = languagePack[id][language][1];  // English: 0, Danish: 1
      inputBoxes[index].lang = lang[language];  // lang = ['en', 'da']
    }
  }

  let texts = document.getElementsByClassName('text');

  for (var index in texts){
    let id = texts[index].id;
    if (languagePack[id]) {
      texts[index].textContent = languagePack[id][language][0];  // languagePack:  {'id': ['text', 'title']}
      texts[index].title = languagePack[id][language][1];  // English: 0, Danish: 1
      texts[index].lang = lang[language];  // lang = ['en', 'da']
    }
  }

  let labelTexts = document.getElementsByClassName('labelText');

  for (var index in labelTexts){
    let id = labelTexts[index].id;
    if (languagePack[id]) {
      labelTexts[index].textContent = languagePack[id][language][0];  // languagePack:  {'id': ['text', 'title']}
      labelTexts[index].title = languagePack[id][language][1];  // English: 0, Danish: 1
      labelTexts[index].lang = lang[language];  // lang = ['en', 'da']
    }
  }
}


function editTask() {
  let id = getIndexFromUniqueId(chosenTaskId);
  let drain = '';

  if (1 < taskList[id].drain) {
    drain = ' d' + taskList[id].drain + ' ';
  } else if (taskList[id].drain < 0) {
    drain = ' g' + (-taskList[id].drain) + ' ';
  }

  taskText = taskList[id].text + ' ' + drain + taskList[id].duration / 60000 + 'm';  //  Save the text from clickedElement

  let dayInputBox = document.getElementById('dayInputBox');
  dayInputBox.value = taskText;  // Insert text in inputBox

  taskList.splice(id, 1);  // Remove clicked task from taskList
  uniqueIdOfLastTouched = taskList[id - 1].uniqueId;

  let button = document.getElementById('clearButton');
  button.textContent = languagePack['clearButtonText'][language][0]; // Black left-pointing small triangle
  button.title = languagePack['clearButtonText'][language][1];
  chosenTaskId = '';

  renderTasks();

  dayInputBox.focus();

  let nextLast = taskText.length - 1;
  dayInputBox.setSelectionRange(nextLast - 2, nextLast); // Makes changing task time easier by focusing just before m in 45m
}

// Used by an eventListener. Toggles zoom.
function zoomFunc() {
  let zoomButton = document.getElementById('zoom');

  zoom = (1 + 0.5) - zoom;
  zoomSymbolModifyer = 7 - zoomSymbolModifyer;

  zoomButton.textContent = String.fromCharCode(9040 + zoomSymbolModifyer); // Toggles between \u2357 ⍐ and \u2350 ⍗

  renderTasks();
  jumpToNow();
}


function createDisplayList(sourceList) {
  let jumpToId = uniqueIdOfLastTouched;
  let currentStressLevel = wakeUpStress;

  displayList = [];
  let duration = 0;

  displayList.push(sourceList[0]);
  sourceList[0].stressGradient = currentStressLevel;

  let len = sourceList.length;
  for (var n=1; n<len; n++) {  // TODO: Fix Add-button position again again. Fix duration in add-view
    // if (sourceList[n - 1].end) { // This condition makes dayStart and dayEnd collapse // TODO: Fix this and insert before a fixed task. Maybe run task.end() somewhere appropriate
      // let duration = sourceList[n].date.getTime() - sourceList[n-1].end.getTime();
    let duration = sourceList[n].date.getTime() - (sourceList[n - 1].date.getTime() + sourceList[n - 1].duration);
    // }
    if (duration > 0) { // Create a nullTime task if there is a timegab between tasks
      let nullTime = new Task(sourceList[n-1].end, duration, '', -1);
      nullTime.uniqueId = sourceList[n-1].uniqueId + 'n';
      nullTime.fuzzyness = 'isNullTime';
      nullTime.startStressLevel = currentStressLevel;
      // nullTime.drain = -1;
      if (n === 1) {
        let colour = 'hsl(255, 100%, ' + (100 - Math.floor(currentStressLevel*10)).toString() + '%)';
        nullTime.stressGradient = [colour, colour];
      } else {
        let result = getStress(nullTime);
        nullTime.stressGradient = result[0];
        currentStressLevel = result[1];
      }
      displayList.push(nullTime);
      duration = 0;
    }
    sourceList[n].startStressLevel = currentStressLevel;
    let result = getStress(sourceList[n]);
    sourceList[n].stressGradient = result[0];
    currentStressLevel = result[1];
    displayList.push(sourceList[n]);
  }

  uniqueIdOfLastTouched = jumpToId;
  return displayList
}


function getStress(task) {
  let currentStressLevel = task.startStressLevel;
  let gradient = ['hsl(255, 100%, ' + (100 - Math.floor(currentStressLevel * 10)).toString() + '%)'];

  let durationM = Math.floor(task.duration / 60000);
  let stress = 0;
  for (var i = 0; i < durationM; i += 5) {
    stress = currentStressLevel * Math.pow(2, i/(tDouble/(task.drain * 2))); // The stress doubles after the time tDouble (in minutes) - or fall if drain is negative
    colourBit = 'hsl(255, 100%, ' + (100 - Math.floor(stress * 10)).toString() + '%)';
    gradient.push(colourBit);
  }

  return [gradient, stress];
}


function displayMessage(text, displayTime, view) {  // displayTime in milliseconds
  console.log(text, view);
  msg = document.getElementById(view + 'Message');
  msg.style.display = 'inline-block';
  // msg.style.color = 'red';
  msg.textContent = text;

  // Add an eventListener to stop annoying messages by clicking anywhere
  setTimeout(function() {document.addEventListener('click', stopTimeout);}, 500);  // A short timeout is necessary in order to not fire immediately

  msgTimeOutID = setTimeout(function() {
    msg.style.display = 'none';
    document.removeEventListener('click', stopTimeout);
  }, displayTime)
}

function stopTimeout() {  // To remove an eventListener anonymous functions can't be used
  clearTimeout(msgTimeOutID);  // clearTimeOut is an inbuildt function.
  msg.style.display = 'none';
  document.removeEventListener('click', stopTimeout);
}

function taskHasBeenClicked(event) {
  let myUniqueId = event.target.id;
  let chosenId = '';
  let id = getIndexFromUniqueId(myUniqueId); // Mostly to check for nulltimes being clicked
  if (chosenTaskId != '') {
    chosenId = getIndexFromUniqueId(chosenTaskId);
  }

  // The eventListener is tied to the parent, so the event given is the parent event
  let contentInputBox = document.getElementById('dayInputBox').value.trim();
  let clearButton = document.getElementById('clearButton');

  if (contentInputBox !== '' && !chosenTaskId) {
    // Text in inputBox and no chosenTaskId. Create new task and insert before clicked element
    if (/[a-c, e-g, i-l, n-z]/.exec(contentInputBox) != null) {
      let parsedList = parseText(contentInputBox);
      let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
      if (nullTimeClicked) {
        nullTimeClicked = false;
        addWhereverAfter(myUniqueId, task);  // Nulltimes shares id with the task before the nulltime
      } else {
        addTaskBefore(myUniqueId, task);
      }
      // // TODO: Check if ChooseBox is active
      // clearButton.textContent = languagePack['clearButton'][language][0]; // Black down-pointing small triangle
      // clearButton.title = languagePack['clearButton'][language][1];
      handleChoosebox('day');
      fixClearButtonArrow();

    } else {
      displayMessage(languagePack['formatReminder'][language], 6000, 'day')
    }
    document.getElementById('addTaskButton').textContent = '+';
    if (!document.getElementById('dayChooseBox').classList.contains('active')) {
      document.getElementById('sortTask').setAttribute('class', 'noTasksToSort');
    }

  } else if (contentInputBox !== '' && chosenTaskId){
    // Text in inputbox and a chosenTaskId. Should not happen.
    nullifyClick();
    console.log('Text in inputbox and a chosenTaskId. Should not happen.');

  }  else if (contentInputBox == '' && !chosenTaskId) {
    // No text in inputBox and no chosenTaskId: Getting ready to edit or delete
    chosenTask = document.getElementById(myUniqueId);
    let myId = getIndexFromUniqueId(myUniqueId);
    taskList[myId].isClicked = 'isClicked'; // TODO: Unclick later
    chosenTaskId = chosenTask.id;
    uniqueIdOfLastTouched = chosenTaskId;

  } else if (contentInputBox == '' && chosenTaskId) {
    // No text in inputBox and a chosenTaskId: Swap elements - or edit if the same task is clicked twice
    if (/[n]/.exec(myUniqueId) != null) {  // If nulltime ...
      // displayMessage('Unasigned time can not be edited', 3000);  // More confusing than helpful(?) Yep. Need clean up.
    } else if (chosenTaskId === myUniqueId) {
      editTask();
      document.getElementById('addTaskButton').textContent = '\u270D';  // Writing hand
      document.getElementById('sortTask').setAttribute('class', 'tasksToSort');
    } else if (taskList[chosenId].fuzzyness === 'isNotFuzzy' || taskList[id].fuzzyness === 'isNotFuzzy') {
      displayMessage(languagePack['fixedTaskClicked'][language], 3000, 'day');
      taskList[chosenId].isClicked = 'isNotClicked';
      taskList[id].isClicked = 'isNotClicked';
    } else if (taskList[chosenId].fuzzyness === 'isFuzzy' && taskList[id].fuzzyness === 'isFuzzy') {
      swapTasks(myUniqueId);
    }
    chosenTaskId = '';
  }
  renderTasks();

}


function getIndexFromUniqueId(uniqueId) {
  if (/[n]/.exec(uniqueId) != null) {  // Nulltimes have the same unique id as the task before them, but with an 'n' attached
    nullTimeClicked = true;
    uniqueId = /[0-9]*/.exec(uniqueId)[0];
  } else {
    nullTimeClicked = false;
  }
  for (const [index, task] of taskList.entries()) {
    if (task.uniqueId.toString() === uniqueId.toString()) {
      return index
    }
  }
}


function swapTasks(myId) { // TODO: Fix swap by allowing inserting task by moving fuzzy tasks
    let id1 = getIndexFromUniqueId(chosenTaskId);
    let id2 = getIndexFromUniqueId(myId);
    taskList[id1].isClicked = 'isNotClicked';
    taskList[id2].isClicked = 'isNotClicked';
    taskList[id1].date = '';
    taskList[id2].date = '';
    [taskList[id2], taskList[id1]] = [taskList[id1], taskList[id2]];
    anneal();
    uniqueIdOfLastTouched = taskList[id1].uniqueId;
}


function anneal() { // TODO: Tasks can end up after 23:59. At least a warning is needed(?)
  fixTimes();
  let len = taskList.length;
  for (var n=1; n<len - 1; n++) {
    if (taskList[n + 1].date < taskList[n].end) {
      [taskList[n], taskList[n + 1]] = [taskList[n + 1], taskList[n]];
      fixTimes();
    }
    if (taskList[n + 1].date - taskList[n].end > 0 && taskList[n + 1].fuzzyness === 'isFuzzy') {
      taskList[n + 1].date = taskList[n].end;
      taskList[n + 1].end = new Date(taskList[n + 1].date.getTime() + taskList[n + 1].duration);
    }
  }
  fixTimes();
}


function fixTimes() {
  let len = taskList.length;
  for (var n=1; n<len - 1; n++) {
    if (taskList[n].end <= taskList[n + 1].date) {
      continue;
    } else if (taskList[n + 1].fuzzyness === 'isFuzzy') {
      taskList[n + 1].date = taskList[n].end;
      taskList[n + 1].end = new Date(taskList[n + 1].date.getTime() + taskList[n + 1].duration);
    } else {
      // console.log(n, 'Overlapping a fixed task');
    }
  }
}


function renderTasks() {
  displayList = createDisplayList(taskList);

  // // Store a backup of taskList
  // let taskListAsText = JSON.stringify(taskListExtractor());
  // if (taskListAsText) {
  //   localStorage.taskListAsText = taskListAsText;
  // }
  storeLocally();

  clearOldTasksEtc();

  // fillStressBar(zoom);
  // fillHearths(10);

  // Make new time markings in timeBar
  fillTimeBar(zoom);

  // Refresh view from taskList
  for (const [index, task] of displayList.entries()) {
    // Create tasks as buttons
    let newNode = document.createElement('button');
    newNode.setAttribute('id', task.uniqueId);
    newNode.classList.add(task.fuzzyness);  // Fuzzyness is used for styling tasks
    newNode.classList.add(task.isClicked);
    newNode.classList.add('task');
    if (Number(task.drain) < 0 && task.fuzzyness != 'isNullTime') {
      newNode.classList.add('isGain');
    }

    // Create stress indicators as divs
    let stressMarker = document.createElement('div');
    stressMarker.textContent = '-';

    stressMarker.classList.add('stressDiv');
    stressMarker.setAttribute('style', 'background-image: linear-gradient(' + task.stressGradient + ')');

    // Set the task height
    if (zoom * task.height < 12) {  // Adjust text size for short tasks
      newNode.style['font-size'] = 4 + 4 * zoom + 'px';
      stressMarker.style['font-size'] = 4 + 4 * zoom + 'px';
    } else if (zoom * task.height < 22) {
      newNode.style['font-size'] = 6 + 6 * zoom + 'px';
      stressMarker.style['font-size'] = 6 + 6 * zoom + 'px';
    } else {
      newNode.style['font-size'] = null;
      stressMarker.style['font-size'] = null;
    }
    // newNode.style['line-height'] = zoom * task.height + 'px';
    // stressMarker.style['line-height'] = zoom * task.height + 'px';
    newNode.style.height = (zoom * task.height * 100) / (24 * 60) + '%';
    stressMarker.style.height = (zoom * task.height * 100) / (24 * 60) + '%';

    // Write text in task
    let nodeText = textExtractor(task);
    let textNode = document.createTextNode(nodeText);
    newNode.appendChild(textNode);

    // Create the elements
    document.getElementById('stressDiv').appendChild(stressMarker);
    document.getElementById('taskDiv').insertAdjacentElement('beforeend', newNode);
  }
}


function clearOldTasksEtc() {
  // // Remove old hearts from heartSpan
  // const heartNode = document.getElementById('heart');
  // while (heartNode.firstChild) {
  //   heartNode.removeChild(heartNode.lastChild);
  // }

  // Remove old task from stressDiv
  const stressNode = document.getElementById('stressDiv');
  while (stressNode.firstChild) {
    stressNode.removeChild(stressNode.lastChild);
  }

  // Remove old time markings from timeBar
  const timeNode = document.getElementById('timeDiv');
  while (timeNode.firstChild) { // Remove old task from view
    timeNode.removeChild(timeNode.lastChild);
  }

  // Remove old task from taskDiv
  const taskNode = document.getElementById('taskDiv');
  while (taskNode.firstChild) {
    taskNode.removeChild(taskNode.lastChild);
  }
}


function jumpTo(index) {
  if (document.getElementById('container') !== null  && taskList.length > 0) {
    container = document.getElementById('container');
    container.scrollTop = document.getElementById(index).offsetTop - 180 * zoom;
    // document.getElementById('dayInputBox').focus();
  }
}


function jumpToNow() {
  let now = new Date()
  let nowMinusOneHour = (now.getHours() - 1).toString() + now.getMinutes().toString();
  jumpToTime(nowMinusOneHour, false);
}


function jumpToTime(time, showMessage) {
  let min = /[0-9][0-9]$/.exec(time);
  let hours = time.toString().replace(min, '');
  if (Number(min) < 30) { // The time-divs are at half hour intervals and we can only jump to time-divs
    min = '00';
    time = hours + min;
  } else {
    min = '30';
    time = hours + min;
  }
  if (document.getElementById('container') !== null  && taskList.length > 0) {
    container = document.getElementById('container');
    timeDiv = document.getElementById(time);  // time in the format of a string ex: '700'
    if (timeDiv) {
      container.scrollTop = timeDiv.offsetTop - 180 * zoom;
      if (showMessage) {
        displayMessage(languagePack['jumpedTo'][language] + hours + ':' + min, 700, 'day');
      }
    } else {
      displayMessage(languagePack['numberNotRecognized'][language], 1000, 'day')
    }
  }
}


function textExtractor(task) {  // Extract the text to be written on screen
  let text = task.text;
  let drain = '';

  if (task.drain != '') {
    if (task.drain > 1) {
      drain = ' d' + task.drain;
    } else if (task.drain < -1) {
      drain = ' g' + (-task.drain);
    }

  }

  if (task.duration != '') {
    let hours = Math.floor(task.duration / 3600000);
    let minutes = Math.floor((task.duration - hours * 3600000) / 60000);
    if (hours > 0 && minutes > 0) {
      text = '(' + hours + 'h' + minutes + 'm' + drain + ') ' + task.text;
    } else if (hours > 0) {
      text = '(' + hours + 'h' + drain + ') ' + task.text;
    } else {
      text = '(' + minutes + 'm' + drain + ') ' + task.text;
    }
  }

  if (task.date != '') {
    let timeH = task.date.getHours();
    let timeM = task.date.getMinutes();
    let endTime = new Date(task.date.getTime() + task.duration);
    let endH = endTime.getHours();
    let endM = endTime.getMinutes();
    // Check if leading zeroes are needed and add them
    let nils = ['', '', '', ''];
    if (timeH < 10) {
      nils[0] = '0';
    }
    if (timeM < 10) {
      nils[1] = '0';
    }
    if (endH < 10) {
      nils[2] = '0';
    }
    if (endM < 10) {
      nils[3] = '0';
    }
    text1 = nils[0] + timeH + ':' + nils[1] + timeM + '-';
    text = text1 + nils[2] + endH + ':' + nils[3] + endM + ' ' + text;
  }

  return text
}


function taskListExtractor() {  // Make a list of strings that can generate the current taskList
  startAndEndTimes = [];
  let taskListAsText = [];
  for (const [index, task] of taskList.entries()) {
    let timeH = task.date.getHours();
    let timeM = task.date.getMinutes();
    if ((timeH === 0 && timeM === 0) || (timeH === 23 && timeM === 59)) {
      continue;
    }
    let text = task.text;

    if (task.duration != '') {
      let hours = Math.floor(task.duration / 3600000);
      let minutes = Math.floor((task.duration - hours * 3600000) / 60000);
      if (hours > 0 && minutes > 0) {
        text = hours + 'h' + minutes + 'm ' + task.text;
      } else if (hours > 0) {
        text = hours + 'h '  + task.text;
      } else {
        text = minutes + 'm ' + task.text;
      }
      updateStartAndEndTimes(timeH, timeM, hours, minutes); // Makes alarm list for toc
    } else {
      updateStartAndEndTimes(timeH, timeM, 0, 30);
    }

    if (task.fuzzyness === 'isNotFuzzy' && task.date != '') {
      let nils = '';
      if (timeM < 10) {
        nils = '0';
      }
      text = timeH + nils + timeM + ' ' + text;
    }

    text += ' d' + task.drain;

    taskListAsText.push(text);

  }
  return taskListAsText;
}


function updateStartAndEndTimes(timeH, timeM, hours, minutes) { // Makes a list of start and end times for sayToc
  var time = '';
  time = 'beginning' + timeH.toString() + timeM.toString() + '0';
  startAndEndTimes.push(time);
  let endH = timeH + hours;
  let endM = timeM + minutes;
  if (59 < endM) {
    endM -= 60;
    endH += 1;
  }
  time = 'end' + endH.toString() + endM.toString() + '0';
  startAndEndTimes.push(time);
}


function parseText(rawText) {
  let taskStart = '';

  let minutes = /[0-9]+m/.exec(rawText);
  if (minutes) { // If 30m is in rawText store number in minutes and remove 30m from rawText
    minutes = /[0-9]+/.exec(minutes).toString();
    rawText = rawText.replace(minutes + 'm', '');
  } else {
    minutes = '0';
  };

  let hours = /[0-9]+h/.exec(rawText);
  if (hours) { // If 2h is in rawText store number in minutes and remove 2h from rawText
    hours = /[0-9]+/.exec(hours).toString();
    rawText = rawText.replace(hours + 'h', '');
  } else {
    hours = '0';
  };

  // Make duration in milliseconds form hours and minutes
  let duration = hours * 3600000 + minutes * 60000;
  if (duration == 0) {
    duration = defaultTaskDuration * 60000; // If no duration is provided use the default task duration
  }

  let time = /[0-9]?[0-9]:?[0-9][0-9]/.exec(rawText);
  if (time) { // If 1230 or 12:30 is found in rawText store numbers in hours and minutes and remove 1230 from rawText
    time.toString().replace(':', '');
    time = time[0].toString();
    if (time.length == 4) {
      timeH = /[0-9][0-9]/.exec(time).toString();
    } else if (time.length == 3) {
      timeH = /[0-9]/.exec(time).toString();
    }
    time = time.replace(timeH, '');
    timeM = /[0-9][0-9]/.exec(time).toString();
    rawText = rawText.replace(timeH + timeM, '');
    // Make new datetime from timeM and timeH
    let now = new Date();
    taskStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM);  // NO need for DST shenanigans here!
  } else {
    timeM = '-1';
    timeH = '-1';
    taskStart = '';
  };


  let drain = /d+[-]*[1-5]+/.exec(rawText);
  if (/d+[-]*[1-5]+/.exec(drain)) {
    drain = /[-]*[1-5]/.exec(drain).toString();
    rawText = rawText.replace('d' + drain, '');
  } else {
    drain = '1';
    // rawText = rawText.replace('d', '');
  };

  let gain = /g+[-]*[1-5]+/.exec(rawText); // Gain counts double as the assumption is consious relaxation
  if (/g+[-]*[1-5]+/.exec(gain)) {
    gain = /[-]*[1-5]/.exec(gain).toString();
    drain = '-' + gain;
    rawText = rawText.replace('g' + gain, '');
  };

  let text = rawText.trim();
  text = text.slice(0, 1).toUpperCase() + text.slice(1, );

  parsedList = [taskStart, duration, text, drain];
  return parsedList;
}


////////////////////////////////// Maintenence code //////////////////////////

// console.table(taskList);  // Remember! Shows a table in the console.
// debugger;  // Remember! Stops execution in order to glean the current value of variable

function debugExamples() {
  let exList = [
    '700 debugging example',
    '1h longOne',
    '30m shortOne',
    '30m shortTwo',
    '45m mediumOne',
    '1200 1h lunch',
    // '1530 1h tea',
    '1h longTwo' ,
    '45m mediumTwo',
    '30m shortThree'
  ];

  console.log('Debugging example list ', exList);

  uniqueIdOfLastTouched = taskList[0].uniqueId;
  textListToTaskList(exList);
  renderTasks();
}


function textListToTaskList(taskListAsText) {  // Used by debugExamples()
  let succes = false;
  if (taskListAsText.length === 0 && taskList.length === 0) {
    makeFirstTasks();
  } else {
    for (const [index, text] of taskListAsText.entries()) {
      let parsedList = parseText(text.trim());
      let id = uniqueIdOfLastTouched;
      let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
      // console.log(task.text, [].concat(taskList));
      succes = addTask(id, task);
      if (!succes) {console.log('Retrieval got wrong at index ', index);}
    }
  }
  // TODO: Fix uniqueIdOfLastTouched. It can't be stored as stuff is redrawn
  uniqueIdOfLastTouched = taskList[localStorage.indexOfLastTouched].uniqueId;
}

// For debugging only:
function showTaskListTimes() {
  let len = taskList.length;
  for (var n=0; n<len; n++) {
    console.log(n, 'Start:', taskList[n].date.getHours(), taskList[n].date.getMinutes(), 'End: ', taskList[n].end.getHours(), taskList[n].end.getMinutes(), taskList[n].text);
  }
}
