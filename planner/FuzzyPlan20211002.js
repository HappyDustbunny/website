// TODO: Clicking while a fixed task is in the input box inserts the tasks disregarding the fixed time. Bug or feature? Same in month view.
// TODO: Integrate the help file in main

let hashStack = [];
let lastHash = '';
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
let tasksSentToDay = [];
let tasksSentToMonth = [];
let language = 0; // English: 0, Danish: 1
let lang = ['en', 'da'];

///////// Add-view /////////
let taskText_add = '';
let taskDuration_add = defaultTaskDuration;  // In minutes
let taskTime_add = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 00);
let drainGainLevel_add = 'd1';

///////// Play-view /////////
let playViewIsRecording = false; // Boolean
let startTime_play = new Date();
let endTime_play = new Date();
let taskText_play = '';

///////// Month-view ////////
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthTaskList = {};  // Future tasks. Dict with all tasks storede in month-view. Technically a JS object usable much like a Python dictionary
let pastDayList = {};   // Past tasks. Old taskList is stored here on their relevant date {"4-1-21": [task, task,...]}
let pastDayListBackUp = {}; // Inelegant way of moving data from one function to the next
let trackTaskList = {}; // Each tracked task have a text-key and a colour and an opacity  Ex: {'morgenprogram': ['#00FF00', '1']}
// let trackTaskList = {'morgenprogram': ['#00FF00', '1'], 'frokost': ['#DD0000', '1'], 'programmere': ['#0000FF', '1']}; // Each tracked task have a text-key and a colour and an opacity  Ex: {'morgenprogram': ['#00FF00', '1']}
let putBackId = '';
let dontShowTrackedAsTooltip = false;
let backupMessageShown = 0;   // Value 0: Not shown yet     1: Shown today

///////// Month-view ////////
let backupFileName = '';

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
'Ekstralager 1', 'Ekstralager 2', 'Ekstralager 3'];
let storageList = {};  // taskList and their names are stored in memory1-17  {'memory1': [[task, task, ...], 'name']}

///////// Languages ///////
let languagePack = {  // {'id': [['text', 'title'], ['tekst', 'titel']]} The variable language is 0 for english and 1 for danish
   // Day view
     "month": [['Month', 'Click to show month (or just swipe rigth)'],
               ['Måned', 'Klik for at vise måned (eller swipe til højre)']],
     "storage": [['Storage', 'Click to show the storage (or just swipe left)'],
                 ['Lagre', 'Klik for at vise lagrene (eller swipe til venstre)']],
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
      'dayInputLabel': [['Input box for entering tasks', ''], // Only for aria label
                   ['Input box til at skrive opgaver ind i', '']],
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
     'planning': [['Planning', ''],
              ['Planlægning', '']],
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
     'drainLevelText': [['\u00a0 Stress level', ''],
                        ['\u00a0 Stressniveau', '']],
     'addInfo': [['?', 'Information and user manual'],
        ['?', 'Information og brugsanvisning']],
     'cancel': [['Cancel', ''],
                ['Afbryd', '']],
     'apply': [['OK', ''],
        ['OK', '']],
     'applyButtonText': [['Ok (Then tap where this task should be)', ''],
        ['OK (Klik der hvor opgaven skal indsættes)', '']],
      'taskPastEndOfDay': [['Oups, a task were pushed past midnight\nPlease put back', ''],
        ['Ups, en opgave blev skubbet forbi midnat\nGeninsæt den venligst', '']],
      // Play View
      'clicksSuppressed': [['You are registering a time period\nPress the red button to stop this\n before doing anything else', ''],
                 ['Du registrerer en tidsperiode\nTryk på den røde knap for\nat foretage dig andet', '']],
      'playButton': [['\u25B8', 'Insert a task from now and until pressed again.\nMinimum time will be 10 minutes'], // Left pointing arrow
                 ['\u25B8', 'Indsætter en opgave fra nu og til knappen trykkes igen\nMinimum tiden vil blive sat til 10 minutter']],
      // Month View
     'track': [['Track', 'Choose which task to track with colours'],
               ['Følg', 'Vælg hvilke opgaver der skal følges']],
     'day': [['Day', 'Click to get back to day-view (or just swipe left anywhere)'],
             ['Dag', 'Klik for at komme tilbage til dagsvisning (eller swipe til venstrehvorsomhelst)']],
     'day1': [['Day', 'Click to get back to day-view (or just swipe right anywhere)'],
             ['Dag', 'Klik for at komme tilbage til dagsvisning (eller swipe til højre hvorsomhelst)']],
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
    // Track view
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
     'selectAllOrNoneLabel': [['Select all or none', ''],
                          ['Vælg alle eller ingen', '']],
     'deleteTrackedButton': [['Remove UNcheked tasks from this list', ''],
                             ['Fjern opgaver UDEN flueben fra denne liste', '']],
     'showTrackedItemsInTooltip': [['Show/hide routine tasks', ''],
                                   ['Vis/skjul rutineopgaver', '']],
     'showTTLabel': [['Show tracked tasks in tool tip in month view', 'Remove checkmark to make it easier to see what made a day special (the tracked routine tasks is not shown)'],
                      ['Vis opgaver der følges i tool tip i månedsvisningen', 'Fjern hakket for at gøre det lettere at se hvad der gør en dag særlig (rutineopgaverne bliver ikke vist så)']],
    // Storage view
     'storageHeadingText': [['Store or retrive tasklists', ''],  // TODO: Remove or make visible? Remove I think
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
     'applyWakeUp': [['Apply', ''],
                ['Andvend', '']],
     'taskDurationHeading': [['Default task duration', ''],
                   ['Standard opgavelængde', '']],
     'taskDurationText': [['Set default task duration in minutes:', ''],
                          ['Sæt stadard opgavelængde i minutter', '']],
      'wakeUpHeading': [['Wake up time', ''],
                        ['Opvågningstid', '']],
      'wakeUpText': [['Set the time you usually wake up and start planning', ''],
                     ['Sæt den tid du sædvanligvis vågner op og planlægger', '']],
     'inputBoxM': [['', 'Set default task duration in minutes'],
                   ['', 'Sæt standardlængden for opgaver i minutter']],
     'inputBoxWakeUp': [['', 'Set the time you usually wake up and start planning'],
                ['', 'Sæt den tid du sædvanligvis vågner op og planlægger']],
     'apply1': [['Apply', ''],
                ['Andvend', '']],
     // 'playTocText': [['Play \'toc\' sound', ''],
     //                 ['Afspil \'tac\' lyd', '']],
     // 'tocLabelOff': [['Off', ''],
     //                 ['Fra', '']],
     // 'tocLabelStart': [['At the beginning of tasks (toc)', ''],
     //                   ['I begyndelsen af en opgave (tac)', '']],
     // 'tocLabelEnd': [['At the end of tasks (toc toc)', ''],
     //                 ['I slutningen af en opgave (tac tac)', '']],
     // 'tocLabelBoth': [['Both at beginning and end of tasks', ''],
     //                  ['Både når opgaven starter og slutter', '']],
     // 'playTicText': [['Play \'tic\' sound', ''],
     //                 ['Afspil \'tic\' lyd', '']],
     // 'ticLabelOff': [['Off', ''],
     //                 ['Fra', '']],
     // 'ticLabelEachX': [['Every X minutes', ''],
     //                   ['Hver X. minut', '']],
     // 'ticLabelRandom': [['Randomly within every X minutes', ''],
     //                    ['Tilfældigt indenfor X minutter', '']],
     // 'ticSpanInterval': [['Time interval X in minutes:', ''],
     //                     ['Tidsinterval X i minutter:', '']],
     // 'inputBoxX': [['', 'Time interval X in minutes'],
     //               ['', 'Tidsinterval X i minutter']],
     // 'apply2': [['Apply', ''],
     //            ['Anvend', '']],
     // 'soundIfFocus': [['Note:\r\nThe sound only play if the page has focus', ''],
     //              ['Bemærk:\r\nLyd afspilles kun, hvis siden har fokus', '']],
     // 'soundIfFocusPlayView': [['Note: The sound only play if the page has focus', ''],
     //              ['Bemærk: Lyd afspilles kun, hvis siden har fokus', '']],
     'stressModelHeading': [['Stress Model', ''],
                       ['Stress Model', '']],
     'settingsInfo': [['?', 'Information about the stress model'],
                       ['?', 'Information om stressmodellen']],
     'stressLevelText': [['Set the stress level you experience\r\nwhen you wake up (1-5, 1 is low)\u00a0', ''],
                         ['Angiv det stressniveau du oplever\r\nnår du vågner (1-5, 1 er lavt)\u00a0', '']],
     'stressLevelDoubleText': [['Set the approximately time for\r\nyour stress level to '
                                + 'double\r\nwhen working without pause (in minutes)', ''],
                               ['Sæt den tid det omtrent tager\r\nfør dit stressniveau '
                                + 'fordobles,\r\nnår du arbejder uden pause (i minutter)', '']],
     'apply3': [['Apply', ''],
                ['Anvend', '']],

     'backupHeading': [['Backup', ''],
                ['Tag backup', '']],
     'backupText': [['Backup settings and lists stored in Month View.\r\n(Note that this backup also can restore the past days in Month View in another browser)', ''],
                ['Tag backup af indstillinger og gamle opgavelister gemt i Månedsvisningen.\r\n(Bemærk at denne backup også kan flytte gamle opgavelister til Månedsvisningen i en anden browser)', '']],
     'backup': [['Backup', ''],
                ['Tag backup', '']],
     'backupInputText': [['Choose a file to overwrite, write your own name for the backup or use the proposed filename', ''],
                ['Vælg en fil at overskrive, skriv dit eget navn for backupen eller benyt det foreslåede', '']],
     'restoreBackupInputText': [['Open the text file with your backup', ''],
                ['Åben tekstfilen med din backup', '']],
      'confirmBackup': [['Confirm backup', ''],
                ['Bekræft backup', '']],
     'restoreBackup': [['Restore backup', ''],
                       ['Gendan backup', '']],
     'cancelBackup': [['Cancel backup', ''],
                       ['Afbryd backup', '']],
     'confirmRestoreBackup': [['Confirm restore of backup', ''],
                       ['Bekræft gendanlse af backup', '']],
     'cancelRestoreBackup': [['Cancel backup', ''],
                       ['Afbryd backup', '']],

     'clearDataHeading': [['Clear data and preferences', ''],
                          ['Slet data og indstillinger', '']],
     'clearAllData': [['Clear current day', ''],
                      ['Slet alle dagens opgaver', '']],
     'clearEverything': [['Clear ALL data and preferences', ''],
                         ['Slet ALLE data og indstillinger', '']],
     'updateAppHeading': [['Update App', ''],
                          ['Opdater App', '']],
     'updateAppText': [['The newest version of this app is only fetched if the button is pushed.\nThere is no roll-back so maybe test the new version in another browser first.\nEach browser will have it\'s own local storage and app version. Move tasks and settings via backups.', ''],
                         ['Den nyeste version af denne app hentes kun hvis du trykker på knappen.\nDen gamle version kan ikke gendannes, så overvej at teste nye versioner først i en anden browser.\nHver browser har sin eget lokale lager og version af appen. Flyt opgaver og instillinger via backup', '']],
     'updateApp': [['Update app', 'The newest version is only fetched if this button is pushed.\nThere is no roll-back so maybe test the new version in another browser first.\nEach browser will have it\'s own local storage and app version. Move tasks and settings via backups.'],
                         ['Opdater app', 'Den nyeste version hentes kun hvis du trykker på knappen.\nDen gamle version kan ikke gendannes, så overvej at teste nye versioner først i en anden browser.\nHver browser har sin eget lokale lager og version af appen. Flyt opgaver og instillinger via backup']],
     'gotoDayFromSettings1': [['Go back', ''],
                       ['Gå tilbage', '']],
    // Messages
     // 'dontUse': [['Please don\'t use ' , ' for task description'],  // Fossile code. May be needed, but most probably not
     //             ['Undlad venligst at bruge ', 'til at beskrive opgaver']],
     'format1h30m': ['Please use the format 1h30m\r\n for 1 hour and 30 minutes',
                     'Brug formatet 1h30m\r\n for 1 time og 30 minutter'],
     'max23h': ['Durations longer than 23 hours is not possible',
                'Varihed længere end 23 timer er ikke muligt'],
     'format1200': ['Please use the format 12:00 or 1200',
                    'Brug formatet 12:00 eller 1200'],
     'taskTextMsg': ['Please write a task text',
                     'Skriv en opgavetekst'],
     'noPastDates': ['Past dates can not be assigned tasks',
                     'Datoer i fortiden kan ikke tildeles opgaver'],
     'useDayView': ['Use Day-view for today\'s tasks',
                    'Brug dagsvisning for dagens opgaver'],
     'considerBackup': ['Consider taking a backup\r\nIt is done in Settings (\u2699)',
                    'Overvej at tage en backup\r\nDet gøres i Indstillinger (\u2699)'],
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
     'chooseABackup': ['Please choose a backup to restore first',
                        'Vælg venligst en backup der skal gendannes'],
     'sureYouWannaRestore?': ['Are you sure you want to restore the backup?\nThe current tasks and settings will be overwritten.',
                        'Er du sikker på at du vil gendanne backuppen?\nDe nuværende opgaver og indstillinger vil blive overskrevet.'],
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
     'retrieveFrom': [['Retrieved list from the \"', '\" storage'],
                      ['Listen hentet fra lageret \"', '\"']],
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
     'overlap': ['There is an overlap with another fixed time.\nPlease choose another time',
                 'Der er et overlap med en anden opgave med fast tid.\nVælg venligst en anden tid'],
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
      // Auto replace
      'pause': ['pause', 'pause'],
      'rest': ['rest', 'hvile'],
      'relax': ['relax', 'afspænding'],
      'meditate': ['meditate', 'meditere'],
      'splatte': ['bliss out', 'splatte'],
};


// Daylight saving time shenanigans
// let today = new Date();
// let january = new Date(today.getFullYear(), 0, 1);
// let july = new Date(today.getFullYear(), 6, 1);
// const dstOffset = (july.getTimezoneOffset() - january.getTimezoneOffset()) * 60000; // Daylight saving time offset in ms

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


// Runs when the page is loaded:
function setUpFunc() {

  taskList = [];
  location.hash = '';
  hashStack = [];
  lastHash = '';

  makeFirstTasks();

  retrieveLocallyStoredStuff();

  resetViews();

  renderLanguage();

  // Set uniqueIdOfLastTouche to the last task before 'Day end'
  uniqueIdOfLastTouched = taskList[taskList.length - 2].uniqueId;

  fillTimeBar(zoom);

  createTimeMarker();

  updateTimeMarker();

  adjustNowAndWakeUpButtons();  // Needs to be after the first tasks is pushed to taskList because of renderTasks() // renderTasks() Is in adjustNowAndWakeUpButtons

  getDueRemindersFromLast3Months();

  jumpToNow(); // Looks like this is the Cumulative Layout Shift Lighthouse complains about :-) Nothing much to be done

  updateHearts(); // Update hearts to current time

  if (playViewIsRecording) {
    changePlayButtonToStopButton();
  }

  // Scale the window to current screen size on reload
  document.getElementById('container').style.height = window.innerHeight - 110 +'px';
  document.getElementById('monthContainer').style.height = window.innerHeight - 110 +'px';
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
  let startList = ['000 1m Day start', '2358 1m Day end']; // Day end can't be from 2359 because this causes Dayend.end = 0:00 on the same day, i.e. dayend.end = daystart.start
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

  localStorage.wakeUpH = wakeUpH;

  localStorage.wakeUpM = wakeUpM;

  localStorage.wakeUpStress = wakeUpStress;

  localStorage.tDouble = tDouble;

  localStorage.idOflastTouched = idOfLastTouched;

  localStorage.language = language;   // Value 0:English 1:Danish

  localStorage.backupMessageShown = backupMessageShown;   // Value 0: Not shown yet    1: Shown today

  localStorage.dontShowTrackedAsTooltip = dontShowTrackedAsTooltip;

  localStorage.playViewIsRecording = playViewIsRecording;

  localStorage.startTime_play = startTime_play;

  localStorage.taskText_play = JSON.stringify(taskText_play);

  if (monthTaskList) {
    localStorage.monthTaskList = JSON.stringify(monthTaskList);
  }

  if (trackTaskList) {
    localStorage.trackTaskList = JSON.stringify(trackTaskList);
  }

  // Store today in pastDayList
  let now = new Date();
  let id = now.getDate().toString() + '-' + now.getMonth().toString() + '-' + now.getFullYear();
  pastDayList[id] = taskListExtractor();  //  Func is used to make a deep copy

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
    return original;
  }

  let deepCopy = {};  // Assume deepCopy is an object
  if (Array.isArray(original)) { // Change it if it turns out to be an array
    deepCopy = [];
  }

  for (var key in original) {
    let value = original[key];

    deepCopy[key] = deepCopyFunc(value);  // Recursively travel the object for objects
  }

  return deepCopy;
}


function fixDatesInList(list) {
  let now = new Date();
  for (const [index, task] of list.entries()) {
    task.date = new Date(task.date);
    if (!task.date) {debugger};
    task.date.setDate(now.getDate());
    task.date.setMonth(now.getMonth());
    task.end = new Date(task.end);
    task.end.setDate(now.getDate());
    task.end.setMonth(now.getMonth());
  }
  return list;
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

  if (localStorage.getItem('wakeUpH')) {
    wakeUpH = localStorage.wakeUpH;
  }

  if (localStorage.getItem('wakeUpM')) {
    wakeUpM = localStorage.wakeUpM;
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

  if (localStorage.getItem('backupMessageShown')) {
    backupMessageShown = Number(localStorage.backupMessageShown);   // Value 0: Not shown yet     1: Shown today
  }

  if (localStorage.getItem('dontShowTrackedAsTooltip')) {
    dontShowTrackedAsTooltip = JSON.parse(localStorage.dontShowTrackedAsTooltip);
  }

  if (localStorage.getItem('playViewIsRecording')) {
    playViewIsRecording = JSON.parse(localStorage.playViewIsRecording);  // Parse to get from "false" to false and "true" to true
  }

  if (localStorage.getItem('startTime_play')) {
    startTime_play = new Date(localStorage.startTime_play);
  }

  if (localStorage.getItem('taskText_play')) {
    taskText_play = JSON.parse(localStorage.taskText_play);
  }

  if (localStorage.getItem('monthTaskList')) {
    monthTaskList = JSON.parse(localStorage.getItem('monthTaskList'));
  }

  if (localStorage.getItem('trackTaskList')) {
    trackTaskList = JSON.parse(localStorage.getItem('trackTaskList'));
  }

  if (localStorage.getItem('pastDayList')) {
    pastDayList = JSON.parse(localStorage.getItem('pastDayList'));
    // Fix dates messed up by JSON.stringify  // Not necessary with new pastDayList -- I hope...
    // for (const key in pastDayList) {
    //   pastDayList[key] = fixDatesInList(pastDayList[key]);
    // }
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


function pushHashChangeToStack() {
  // Update hashStack list
  hashStack.push(location.hash);
  if (10 < hashStack.length) {
    hashStack.shift();  // Pop from the begining of the array
  }
}


function bindNavigation() {  // Called by eventlistener on 'hashchange'

  // Find out where to go
  let len = hashStack.length;
  // console.log(hashStack[len - 1], location.hash);

  if (0 < len && (location.hash == '' || hashStack[len - 1] != location.hash)) {
    let hashParts = hashStack[len - 1].replace('#', '').split('_');
    let reversedHash = '#' + hashParts[1] + '_' + hashParts[0];
    if (1 < hashStack.length) {
      hashStack.pop();
    }
    navigateTo(reversedHash);
  } else {

    navigateTo(location.hash);
  }
}


function navigateTo(thisPlace) {
  if (thisPlace == '#dayView_storageView') {
    gotoStorageFromDay();
  } else if (thisPlace == '#storageView_dayView') {
    gotoDayFromStorage();
  } else if (thisPlace == '#dayView_settingsView') {
    gotoSettingsFromDay();
  } else if (thisPlace == '#settingsView_dayView') {
    gotoDayFromSettings();
  } else if (thisPlace == '#dayView_monthView') {
    gotoMonthFromDay();
  } else if (thisPlace == '#monthView_dayView') {
    gotoDayFromMonth();
  } else if (thisPlace == '#trackView_monthView') {
    gotoMonthFromTrack();
  } else if (thisPlace == '#monthView_trackView') {
    gotoTrackFromMonth();
  } else if (thisPlace == '#dayView_addView') {
    addTaskButtonClicked();
  } else if (thisPlace == '#addView_dayView') {
    gotoDayFromAdd();
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

    // Stuff the currently processed day into tasksSentToDay
    if (monthTaskList[myId]) {
      thisDay = monthTaskList[myId];
      if (0 < tasksSentToDay.length) {
        Object.assign(tasksSentToDay, thisDay); // Joins two objects by modifying the first with the added values https://attacomsian.com/blog/javascript-merge-objects
      } else {
        tasksSentToDay = thisDay;
      }

      delete monthTaskList[myId];
    }
  }

  // If there is tasksSentToDay show toDoButton
  if (0 < tasksSentToDay.length) {
    document.getElementById('toDoButton').hidden = false;
  }
}


function fillChooseBox(whichView) {  // whichView can be 'month' or 'day'
  let chooseBox = document.getElementById(whichView + 'ChooseBox');
  chooseBox.classList.add('active');
  let tasks = [];

  // Restore buttons in relevant view
  if (whichView != 'day') { // whichView is 'month'
    document.getElementById('putBack').classList.add('active');
    document.getElementById('moveToDay').classList.add('active');

    if (0 < tasksSentToMonth.length) {
      tasks = tasksSentToMonth;
      tasksSentToMonth = [];
    } else if (0 < tasksFromClickedDayInMonth.length) {
      tasks = tasksFromClickedDayInMonth ;
    } else {
      console.log('Nothing to show in ChooseBox');
    }

  } else {  // whichView is 'day'
    document.getElementById('postpone').classList.add('active'); // The class 'active' is being used for CSS formatting. I think

    tasks = tasksSentToDay;
    tasksSentToDay = [];

    if (tasks.length != 0 || document.getElementById('dayChooseBox').classList.contains('active')) {
      document.getElementById('sortTask').classList.toggle('tasksToSort',true); // Add the class tasksToSort due to 'true' flag
    } else {
      document.getElementById('sortTask').classList.remove('tasksToSort');
    }

  }

  // Actually fill choose box
  if (tasks.length > 0) {
    let counter = 0;
    for (var task of tasks) {
      if (counter === 0) {
        document.getElementById(whichView + 'InputBox').value = task.text;
        // document.getElementById(whichView + 'InputBox').value = task.text + ' ' + task.duration/60000 + 'm';
      } else {
        newButton = document.createElement('button');
        newButton.classList.add('floatingTask');
        newButton.textContent = task.text;
        // newButton.textContent = task.text + ' ' + task.duration/60000 + 'm';
        newButton.setAttribute('id', 'task' + counter);

        document.getElementById(whichView + 'ChooseBox').appendChild(newButton);
      }

      counter += 1;
    }
    let clearButton = document.getElementById('clearButton');
    clearButton.textContent = languagePack['clearButtonText'][language][0];  // Black left-pointing small triangle
    clearButton.title = languagePack['clearButtonText'][language][1];
  }
}


function postponeTask() {
  let contentInputBox = document.getElementById('dayInputBox').value.trim();
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);

  // Store task in tomorrow of pastDayList
  let now = new Date();
  let tomorrowId = (now.getDate() + 1).toString() + '-' + now.getMonth().toString() + '-' + now.getFullYear();
  if (monthTaskList[tomorrowId]) {
    monthTaskList[tomorrowId].push(task);
  } else {
    monthTaskList[tomorrowId] = [task];
  }

  if (!document.getElementById('dayChooseBox').classList.contains('active')) {
    document.getElementById('sortTask').classList.toggle('tasksToSort', false);  // Remove class tasksToSort due to 'false' flag
  }
  resetInputBox('day');
  anneal();
  renderTasks();
  fixClearButtonArrow();
}


function moveToDay() {
  let contentInputBox = document.getElementById('monthInputBox').value.trim();
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
  tasksSentToDay.push(task);
  resetInputBox('month');
}

// Clear input box and give it focus
function resetInputBox(whichView) { // whichView can be 'day' or 'month'
  document.getElementById(whichView + 'InputBox').value = '';
  document.getElementById(whichView + 'InputBox').focus();
  handleChoosebox(whichView);
}


function handleChoosebox(whichView) {
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

  // // Update alarm Toc sound
  // let taskAlarms = localStorage.radioButtonResultAlarm;
  // if (taskAlarms != 'off') {
  //   let nowTime = hours.toString() + min.toString() + sec.toString();
  //   let nowMinusFiveTime = hours.toString() + (min - 5).toString() + sec.toString();
  //   if (taskAlarms === 'beginning' || taskAlarms === 'both') {
  //     if (startAndEndTimes.includes('beginning' + nowTime)) {
  //       sayToc();
  //     }
  //   }
  //   if (taskAlarms === 'end' || taskAlarms === 'both') {
  //     if (startAndEndTimes.includes('end' + nowMinusFiveTime)) {
  //       sayTic();
  //       setTimeout(sayToc, 300);
  //     }
  //   }
  // }
  //
  // // Update reminder Tic sound
  // let reminder = localStorage.radioButtonResultReminder;
  // if (reminder != 'off') {
  //   if (reminder === 'regularly') {
  //     if (min % localStorage.ticInterval === 0 && sec === 0) {
  //       sayTic();
  //     }
  //   }
  //   if (reminder === 'rand') {
  //     let randTime = Math.floor(Math.random() * (localStorage.ticInterval - 1) + 1);
  //     if (min % randTime === 0 && sec === 0) {
  //       sayTic();
  //     }
  //   }
  // }
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

// function sayToc() { // Sound credit https://freesound.org/people/fellur/sounds/429721/
//   let sound = new Audio('429721__fellur__tic-alt.wav');
//   sound.play();
// }
//
//
// function sayTic() {  // Sound credit https://freesound.org/people/Breviceps/sounds/448081/
//   let sound = new Audio('448081__breviceps__tic-toc-click.wav');
//   sound.play();
// }
//
//
// function sayGong() {  // Sound credit https://freesound.org/people/Q.K./sounds/56241/
//   let sound = new Audio('56241__q-k__gong-center-mute.wav');
//   sound.play();
// }

////// Eventlisteners  //////

window.addEventListener('hashchange', bindNavigation);

document.getElementById('info').addEventListener('click', gotoInfo);
document.getElementById('month').addEventListener('click', function () { location.hash = '#dayView_monthView'; pushHashChangeToStack(); });

// Unfold settings
document.getElementById('gotoSettings').addEventListener('click', function () {location.hash = '#dayView_settingsView'; pushHashChangeToStack(); });

document.getElementById('postpone').addEventListener('click', postponeTask);

// Insert a 15 min planning task at start-your-day time according to settings
// document.getElementById('upButton').addEventListener('click', wakeUpButton, {once:true});
document.getElementById('upButton').addEventListener('click', function() {
  let padding = '';
  if (wakeUpM < 10) {
    padding = '0';
  }
  let targetTime = wakeUpH + padding + wakeUpM;
  jumpToTime(targetTime, false);
});
// document.getElementById('upButton').addEventListener('click', function() {jumpToTime(700, false);});

// Insert a 15 min planning task at the current time
// document.getElementById('nowButton').addEventListener('click', nowButton, {once:true});
document.getElementById('nowButton').addEventListener('click', jumpToNow);

// Makes pressing Enter add task
document.getElementById('dayInputBox').addEventListener('keypress', function () { inputAtEnter(event); });
// document.getElementById('dayInputBox').addEventListener('touchend', function () { inputAtEnter(event); });

// Tie event to Clear or Edit button
document.getElementById('clearButton').addEventListener('click', clearTextboxOrDay);

// Tie event to zoom button (⍐ / ⍗). Toggles zoom
document.getElementById('zoom').addEventListener('click', zoomFunc);

// Makes clicking anything inside the taskDiv container run taskHasBeenClicked()
document.getElementById('taskDiv').addEventListener('click', function () { taskHasBeenClicked(event); }, true);

document.getElementById('toDoButton').addEventListener('click', toDoButtonClicked);


////////// Eventlisteners for Add-view   /////////////////////

document.getElementById('addTaskButton').addEventListener('click', function () { location.hash = '#dayView_addView'; pushHashChangeToStack(); });

document.getElementById('inputBox_add').addEventListener('focusout', readInputBox_add);

document.getElementById('inputBox_add').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readTaskText(); } });

document.getElementById('inputDurationBox').addEventListener('focus',
        function() {document.getElementById('inputDurationBox').select();} );
document.getElementById('inputTimeBox').addEventListener('focus',
        function() {document.getElementById('inputTimeBox').value = '12:00';
          document.getElementById('inputTimeBox').select();} );

document.getElementById('inputDurationBox').addEventListener('keypress',
        function () { if (event.key === 'Enter') { readDurationTime(); } });

document.getElementById('inputTimeBox').addEventListener('focusout',
        function () {readTaskStartTime(); fillTimeBox(taskTime_add);
        document.getElementById('inputTimeBox').blur;} );

document.getElementById('inputDurationBox').addEventListener('focusout',
        function () {readDurationTime(); fillDurationBox(taskDuration_add);
        document.getElementById('inputTimeBox').blur;} );

document.addEventListener('touchstart', function() {swipeNavigationStart(event);});
document.addEventListener('touchend', function() {swipeNavigationEnd(event);});

document.getElementById('duration').addEventListener('click', function () { addDuration(event);});

document.getElementById('time').addEventListener('click', function () { time_add(event);});

document.getElementById('clear').addEventListener('click', clearTimeBox);

document.getElementById('now').addEventListener('click', setTimeNow);

document.getElementById('addInfo').addEventListener('click', gotoInfoStress);

document.getElementById('cancel').addEventListener('click', function () { location.hash = '#addView_dayView'; pushHashChangeToStack(); });

document.getElementById('applyAdd').addEventListener('click', apply);

// Running a timer when the page looses focus is tricky. The play and tic part of the app will be dropped for now. This message is pasted before all uncommented sections in main.js and main.html
////////// Eventlisteners for Play-view   /////////////////////

document.getElementById('playButton').addEventListener('click', playButtonClicked);

// document.getElementById('playControlsQuery').addEventListener('click', playControlsQuery);

// document.getElementById('stopButton').addEventListener('click', stopButtonPressed);


////////////////// Eventlisteners for Month-view ///////////////////////

document.getElementById('track').addEventListener('click', function () { location.hash = '#monthView_trackView'; pushHashChangeToStack(); });

document.getElementById('monthInputBox').addEventListener('keypress', function () { monthInputAtEnter(event); });

document.getElementById('monthTaskDiv').addEventListener('click', function () { monthTaskHasBeenClicked(event); }, true);

document.getElementById('day').addEventListener('click', function () { location.hash = '#monthView_dayView'; pushHashChangeToStack(); });

document.getElementById('monthClearButton').addEventListener('click', monthClearBehavior);

document.getElementById('moveToDay').addEventListener('click', moveToDay);

document.getElementById('putBack').addEventListener('click', putBack);

////////////////// Eventlisteners for Month-view ///////////////////////

document.getElementById('month1').addEventListener('click', function () { location.hash = '#trackView_monthView'; pushHashChangeToStack(); });

////////////////// Eventlisteners for track-view ///////////////////////

document.getElementById('colourPickerInputBox').addEventListener('focus', function () {
  document.getElementById('colourButtons').hidden = false;
});

// document.getElementById('colourPickerInputBox').addEventListener('blur', function () {
//   document.getElementById('colourButtons').hidden = true;
// });

document.getElementById('colourButtons').addEventListener('click', function () { colourButtonClicked(event);});

document.getElementById('selectAllOrNoneChkbox').addEventListener('click', selectAllOrNone);

document.getElementById('taskPickerInputBox').addEventListener('keypress', function () { taskPickerEvent(event); });

document.getElementById('colourPickerInputBox').addEventListener('keypress', function () { colourPickerEvent(event); });

document.getElementById('deleteTrackedButton').addEventListener('click', removeTracking);

document.getElementById('showTTChkbox').addEventListener('click', showOrHideTrackedTasksInTooltip);

////////////////// Eventlisteners for storage-view ///////////////////////

document.getElementById('storage').addEventListener('click', function () { location.hash = '#dayView_storageView'; pushHashChangeToStack(); });

document.getElementById('day1').addEventListener('click', function () { location.hash = '#storageView_dayView'; pushHashChangeToStack(); });

document.getElementById('storeList').addEventListener('click', storeList);

document.getElementById('stores').addEventListener('click', function () { storeHasBeenClicked(event); }, true);

////////////////// Eventlisteners for settings-view ///////////////////////

document.getElementById('gotoDayFromSettings').addEventListener('click', function () { resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed
  location.hash = '#settingsView_dayView'; pushHashChangeToStack(); });
document.getElementById('gotoDayFromSettings1').addEventListener('click', function () { resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed
  location.hash = '#settingsView_dayView'; pushHashChangeToStack(); });

document.getElementById('eng').addEventListener('click',
          function () { document.getElementById('en').checked = true; } );

document.getElementById('dan').addEventListener('click',
          function () { document.getElementById('da').checked = true; } );

document.getElementById('apply0').addEventListener('click', applyLanguage);

document.getElementById('apply1').addEventListener('click', applyTaskDuration);

document.getElementById('applyWakeUp').addEventListener('click', applyWakeUpTime);

document.getElementById('settingsInfo').addEventListener('click', gotoInfoStress);

document.getElementById('apply3').addEventListener('click', applyStressModel);

document.getElementById('clearAllData').addEventListener('click', clearAllData);
document.getElementById('clearEverything').addEventListener('click', clearEverything);
document.getElementById('updateApp').addEventListener('click', updateApp);

document.getElementById('inputBoxM').addEventListener('focus',
          function () { document.getElementById('inputBoxM').select(); });

document.getElementById('inputBoxWakeUp').addEventListener('focus',
          function () { document.getElementById('inputBoxWakeUp').select(); });

document.getElementById('stressLevel').addEventListener('focus',
          function () { document.getElementById('stressLevel').select(); });

document.getElementById('tDouble').addEventListener('focus',
          function () { document.getElementById('tDouble').select(); });

document.getElementById('backup').addEventListener('click', prepareStoreBackup);

document.getElementById('cancelBackup').addEventListener('click', resetBackupButtons);
document.getElementById('cancelRestoreBackup').addEventListener('click', resetBackupButtons);

document.getElementById('backupInput').addEventListener('change', fixBackupNameFromBrowsedNames);
document.getElementById('backupInputFixed').addEventListener('change', fixBackupNameFromWrittenName);

document.getElementById('confirmBackup').addEventListener('click', confirmBackup);

document.getElementById('backupInputFixed').addEventListener('focus',
          function () { document.getElementById('backupInputFixed').select(); });

document.getElementById('restoreBackup').addEventListener('click', restoreBackup);

document.getElementById('confirmRestoreBackup').addEventListener('click', confirmRestoreBackup);

//////////////////// Add-view code below ///////////////////////////

function addTaskButtonClicked() {
  storeLocally();
  drainGainLevel_add = 'd1';

  displayClass('dayView', false);
  displayClass('addView', true);

  fillDurationBox(defaultTaskDuration);

  clearTimeBox();

  document.getElementById('d1').checked = 'checked';

  document.getElementById('applyAdd').hidden = false;
  document.getElementById('stopButton').hidden = true;

  // document.getElementById('applyAdd').textContent = 'Ok (then tap where this task should be)';

  let inputBox = document.getElementById('dayInputBox');         // Day-inputBox
  let inputBox_add = document.getElementById('inputBox_add'); // Add-inputBox

  inputBox_add.value = inputBox.value;

  readInputBox_add();

  if (inputBox_add.value == '') {
    inputBox_add.value = '';
    inputBox_add.focus();
  }
}


function readInputBox_add() {
  let inputBox_add = document.getElementById('inputBox_add'); // Add-inputBox

  let text = inputBox_add.value;

  if (text != '') {  // Parse the value and fill relevant boxes

    parsedList = parseText(text); // parsedList = [taskStart, duration, text, drain];
    inputBox_add.value = parsedList[2];
    inputBox_add.blur();

    fillDurationBox(parsedList[1] / 60000);

    // if (playViewActive && /[0-9]+h/.exec(text) != null || /[0-9]+m/.exec(text) != null) {
    //   playControlsQuery(false);
    // }

    if (parsedList[0] != '') {  // This will rarely trigger because fixed times are currently stripped when double clicking a task to edit
      fillTimeBox(parsedList[0]);
    }

    let drain = Number(parsedList[3]);

    if (drain == 1) { // Check for keywords and add appropriate number of hearts
      if (text.toLowerCase().includes(languagePack['pause'][language])) {
        drain = '-1';
        document.getElementById('inputBox_add').removeEventListener('focusout', readInputBox_add);
      };
      if (text.toLowerCase().includes(languagePack['rest'][language])) {
        drain = '-3';
        document.getElementById('inputBox_add').removeEventListener('focusout', readInputBox_add);
      };
      if (text.toLowerCase().includes(languagePack['relax'][language])) {
        drain = '-5';
        document.getElementById('inputBox_add').removeEventListener('focusout', readInputBox_add);
      };
      if (text.toLowerCase().includes(languagePack['meditate'][language])) {
        drain = '-5';
        document.getElementById('inputBox_add').removeEventListener('focusout', readInputBox_add);
      };
      if (text.toLowerCase().includes(languagePack['splatte'][language])) {
        drain = '-5';
        document.getElementById('inputBox_add').removeEventListener('focusout', readInputBox_add);
      };
    }

    if (0 < drain) {
      document.getElementsByClassName('drain')[5 - drain].checked = true;
    } else {
      document.getElementsByClassName('drain')[4 - drain].checked = true;
    }
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

    // if (playViewActive) {
    //   durationTimeChangeInPlayView();
    // }
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
    let applyButton = document.getElementById('applyAdd');
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

  document.getElementById('applyAdd').textContent = 'Ok'; // Remove instruction from return-button as the task will be added the right place automatically
}


function setTimeNow() {
  taskTime_add = new Date();
  fillTimeBox(taskTime_add);
}


function clearTimeBox() {
  document.getElementById('inputTimeBox').value = '';
  document.getElementById('applyAdd').textContent = languagePack['applyButtonText'][language][0];
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

  return prettyTaskTime;
}


function readTaskText() {
  let contentInputBox = document.getElementById('inputBox_add').value.trim();
  taskText_add = contentInputBox;

  // Test for bad characters dropped because no characters will harm functionality afik - and it is a bitch to get working while allowing emojies
}


function readDurationTime() {
  let contentInputBox = document.getElementById('inputDurationBox').value.trim();
  let badCharacters = /[^0-9hm]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage(languagePack['format1h30m'][language], 3000, 'add');
  } else {
    let timeH = 0;
    let timeM = /\d{1,4}m?$/.exec(contentInputBox).toString();
    timeM = Number(timeM.replace('m', ''));
    if (/h/.exec(contentInputBox)) {
      timeH = /[0-9]+h/.exec(contentInputBox).toString();
      contentInputBox = contentInputBox.replace(timeH, '');
      timeH = Number(timeH.replace('h', ''));
    }
    taskDuration_add = timeH * 60 + timeM;
    if (23*60 < taskDuration_add) {
      displayMessage(languagePack['max23h'][language], 3000, 'add');
      taskDuration_add = 30;
      fillDurationBox(taskDuration_add);
    }
  }
}


function readTaskStartTime() {
  if (document.getElementById('inputTimeBox').value != '') {
    let [timeH, timeM] = readTimeBox('inputTimeBox');
    let now = new Date();
    taskTime_add = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM);
    fillTimeBox(taskTime_add);
    return taskTime_add;
  } else {
    return '';
  }

}

function readTimeBox(whichBox) { // whichBox can be 'inputTimeBox' or 'inputBoxWakeUp'
  let timeH = '';
  let timeM = '';
  let contentInputBox = document.getElementById(whichBox).value.trim();
  let badCharacters = /[^0-9:]/.exec(contentInputBox);
  if (badCharacters) {
    displayMessage(languagePack['format1200'][language], 3000, 'add');
  } else {
    let colonPresent = /:/.exec(contentInputBox);
    let colonOffset = 0;
    if (colonPresent) {
      colonOffset = 1;
    }
    if (contentInputBox.length == 3 + colonOffset) { // Not 3 because of colon...
      timeH = /[0-9]/.exec(contentInputBox).toString();
    } else if (contentInputBox.length == 4 + colonOffset) { // Not 4 because of colon...
      timeH = Number(/[0-9][0-9]/.exec(contentInputBox)).toString(); // Number() to get rid of leading zeroes
    } else {
      return;
    }
    contentInputBox = contentInputBox.replace(timeH, '');
    timeM = Number(/[0-9][0-9]/.exec(contentInputBox)).toString();

    return [timeH, timeM];
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

  readTaskText();
  readDrainGainRadioButtons();

  let prettyTaskTime = '';
  if (document.getElementById('inputTimeBox').value.trim() === '') {
    returnText =  taskText_add + ' '
    + taskDuration_add + 'm '
    + drainGainLevel_add;
    return returnText;
  } else {
    prettyTaskTime = prettifyTime(taskTime_add);
    readDurationTime();
  }

  returnText =  taskText_add + ' '
  + prettyTaskTime.replace(':', '') + ' '
  + taskDuration_add + 'm '
  + drainGainLevel_add;

  return returnText;
}


function apply() {
  let taskText = document.getElementById('inputBox_add').value;
  if (taskText === '') {
    displayMessage(languagePack['taskTextMsg'][language], 3000, 'day');  // Please write a task text
  } else {
    // Insert directly if starttime or send returnText to dayInputBox to be manually inserted
    let startTime = readTaskStartTime();

    let returnText = formatTask();

    if (startTime) {
      handleTaskInput(returnText);
    } else {
      document.getElementById('dayInputBox').value = returnText;
    }

    // Close add-view
    document.getElementById('addView').hidden = true;
    document.getElementById('dayView').hidden = false;
    displayClass('addView', false);
    displayClass('dayView', true);

    location.hash = '#addView_dayView';
    pushHashChangeToStack();
  }
}

function gotoDayFromAdd() {
  // Close add-view
  displayClass('addView', false);
  displayClass('dayView', true);
}

//////////////////// Add-view button code above ///////////////////////////

// Helper function for Add-view and Play-view
function displayClass(className, displayStatus) {  // displaystatus can be 'true' or 'false'
  // console.log('displayClass', className, displayStatus);

  // Check if the className is used as id and if so, turn the element with this id on or off
  let id = document.getElementById(className);
  if (id) {
    id.hidden = !displayStatus; // hidden is false if something should be displayed, hence !displayStatus
  }

  let members = document.getElementsByClassName(className);
  for (var i = 0; i < members.length; i++) {
    if (displayStatus) {
      members[i].classList.add('active');
    } else {
      members[i].classList.remove('active');
    }
  }

  if (displayStatus) {
    if (location.hash == '#dayView_monthView' || location.hash == '#storageView_dayView'
    || location.hash == '#monthView_trackView'){
      id.style.transform = 'translate(-500px)';
      setTimeout(function() { id.style.transform = 'translate(0px)'; }, 20);
    } else if (location.hash == '#trackView_monthView' || location.hash == '#monthView_dayView'
    || location.hash == '#dayView_storageView'){
      id.style.transform = 'translate(500px)';
      setTimeout(function() { id.style.transform = 'translate(0px)'; }, 20);
    } else if (location.hash == '#dayView_addView') {
      id.style.transform = 'translate(50px, 100px)';
      setTimeout(function() { id.style.transform = 'translate(0px, 0px)'; }, 20);
    } else if (location.hash == '#addView_dayView') {
      id.style.transform = 'translate(0px)';
    }
    // document.getElementById('monthView').style.transform = 'translate(-500px)';
    // setTimeout(function() {document.getElementById('monthView').style.transform = 'translate(0px)'; console.log('gok');}, 20);
  }

}

// Running a timer when the page looses focus is tricky. The play and tic part of the app will be dropped for now. This message is pasted before all uncommented sections in main.js and main.html
// It may be done using progressive web app tech or Page Lifecycle APIs
// See here https://stackoverflow.com/questions/58244539/best-practice-for-keeping-timer-running-in-pwa
// And here https://developers.google.com/web/updates/2018/07/page-lifecycle-api
// document.addEventListener('freeze', function () { console.log('rappelapgyk'); }); // Hmm. Doesn't seem to work when page looses focus or navigate to other page

// //////////////////// Play-view button code below ///////////////////////////

function playButtonClicked() {

  let thisButton = document.getElementById('playButton');

  if (playViewIsRecording) {  // Make playButton behave as Stop button
    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
    let currentText = document.getElementById('dayInputBox').value;


    if (now - startTime_play < now - midnight) { // Is it still the same day or did you forget starting the recording?
      let deltaTime = Math.trunc((now - startTime_play) / 60000);  // The current task time since start in minutes

      if (deltaTime < 10) {
        deltaTime = 10;
      }

      if (currentText == '') {
        currentText = JSON.parse(localStorage.taskText_play);
      }

      let returnText = currentText + ' ' + deltaTime + 'm ' + prettifyTime(startTime_play).replace(':', '');

      handleTaskInput(returnText);
    } else {
      currentText = JSON.parse(localStorage.taskText_play);
    }

    playViewIsRecording = false;
    taskText_play = '';
    thisButton.classList.remove('stop');
    document.getElementById('playButtonTap').classList.remove('stop');
    document.getElementById('playButtonTop').classList.remove('stop');
    thisButton.textContent = '\u25B8'; // Left pointing arrow

    document.getElementById('page').removeEventListener('click', suppressClicks, true);

    storeLocally();

    fixClearButtonArrow();

  } else {  // Behave as Play button
    let contentInputBox = document.getElementById('dayInputBox').value;

    if (contentInputBox === '') {
      displayMessage(languagePack['taskTextMsg'][language], 3000, 'add');  // Please write a task text
    } else {
      startTime_play = new Date();

      playViewIsRecording = true;

      taskText_play = contentInputBox;

      changePlayButtonToStopButton();

      storeLocally();

      document.getElementById('page').addEventListener('click', suppressClicks, true);
    }
  }
}


function changePlayButtonToStopButton() {
  let thisButton = document.getElementById('playButton');
  thisButton.classList.add('stop');
  thisButton.textContent = '\u25A0';  // Square
  document.getElementById('playButtonTap').classList.add('stop');
  document.getElementById('playButtonTop').classList.add('stop');
}


function suppressClicks(e) {
  if (e.target.id != 'playButton') {
    e.stopPropagation();
    displayMessage(languagePack['clicksSuppressed'][language][0], 4000, 'day');
  }
}
// //////////////////// Play-view button code above ///////////////////////////


//////////////////// Month-view code below ///////////////////////////

function gotoMonthFromDay() {
  storeLocally();

  displayClass('dayView', false);
  displayClass('monthView', true);
  // setTimeout(function() {document.getElementById('monthView').style.transform = 'translate(-500px)'; console.log('rap');}, 500);
  // document.getElementById('monthView').style.transform = 'translate(-500px)';
  // setTimeout(function() {document.getElementById('monthView').style.transform = 'translate(0px)'; console.log('gok');}, 20);


  fillMonthDateBar();

  monthRenderTasks();

  if (0 < tasksSentToMonth.length) {
    fillChooseBox('month');
  }
}


function gotoDayFromMonth() {
  displayClass('monthView', false);
  displayClass('dayView', true);

  fillChooseBox('day');
}


function findFirstDateInPastDayListAndReturnNumberOfMonthsSince() {
  let oldestDate = new Date();

  let dateKeys = Object.keys(pastDayList);

  for (key of dateKeys) {
    let year = /\d\d\d\d\b/.exec(key)[0];
    let month = /-.+-/.exec(key)[0].replace(/-/g, '');
    let thisDate = new Date(year, month);

    if (thisDate < oldestDate) {
      oldestDate = thisDate;
    }
  }

  let deltaMonths = Math.trunc((new Date() - oldestDate) / (30 * 24 * 3600000)) + 1;
  if (deltaMonths < 1) {
    deltaMonths = 1;
  }

  return deltaMonths;
}


function fillMonthDateBar() {
  // Remove old content
  while (monthTaskDiv.firstChild) {
    let monthTaskDiv = document.getElementById('monthTaskDiv');
    monthTaskDiv.removeChild(monthTaskDiv.lastChild)
  }


  let now = new Date();
  let nowMinusSomeMonths = new Date();
  let someMonths = findFirstDateInPastDayListAndReturnNumberOfMonthsSince();
  nowMinusSomeMonths = new Date(nowMinusSomeMonths.setMonth(nowMinusSomeMonths.getMonth() - someMonths));
  let nowPlus3Month = new Date();
  nowPlus3Month = new Date(nowPlus3Month.setMonth(nowPlus3Month.getMonth() + 3));

  let thisMonth = nowMinusSomeMonths.getMonth(); // Hepls insert monthnames just once per month

  for (let i = nowMinusSomeMonths; i < nowPlus3Month; i.setDate(i.getDate() + 1)) {
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

    if (i < now) {  // For styling purposes.
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

  let contentInputBox = document.getElementById('monthInputBox').value.trim();
  let day =  document.getElementById(myId);

  if (day.classList.contains('pastDateButton') && contentInputBox != '') {
    displayMessage(languagePack['noPastDates'][language], 3000, 'month');
    return
  } else if (day.classList.contains('todayButton')) {
    displayMessage(languagePack['useDayView'][language], 3000, 'month');
    return
  }


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
        }
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
      let dateArray = /\d+\/\d+ \d+\d+/.exec(contentInputBox);
      if (!dateArray) {  // If no year information is present
        dateArray = /\d+\/\d+/.exec(contentInputBox);
      }

      if ( dateArray != null ) {
        // Is it a legit date?
        let now = new Date();
        let month = (Number(/\/\d+/.exec(dateArray[0])[0].replace('\/', '')) - 1).toString();
        let day = (/\d+\//.exec(dateArray[0])[0].replace('\/', '')).toString();
        let year = '';
        if (/ \d+\d+/.exec(dateArray[0])){
          year = (/ \d+\d+/.exec(dateArray[0])).toString();
          year = year.trim();
        }
        if (year == '') {
          year = now.getFullYear();
        }

        if ( day <= 31 && month <= 11 ) {

            let textInputBox = contentInputBox.replace(dateArray[0], '').trim();
            // Make myId from date
            let myId = '';

            if (year < now.getFullYear() || month < now.getMonth() || (month == now.getMonth() && day < now.getDate())) {
              displayMessage(languagePack['noPastDates'][language], 4000, 'month');
              return;
            }

            if (year != '' && now.getFullYear() <= year) {
              myId = day + '-' + month + '-' + year;
            }  else {
              if (day <= now.getDate() && month <= now.getMonth()) {
                displayMessage(languagePack['noPastDates'][language], 4000, 'month');
                return;
              }
              myId = day + '-' + month + '-' + now.getFullYear();
            }

            if (textInputBox === '') {
              // gotoDate(myId); // TODO: Make gotoDate() (yank it from month.js?) and sanitize input
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
    // let tasks = createDisplayList(pastDayList[myId]);
    let tasks = pastDayList[myId];

    if (!tasks || tasks.length == 0) {  // Skip empty entries
      continue;
    }

    let gradient = 'white 0%, ' + 'white' + ' ';
    let taskColour = 'white';
    let startPercent = 0;
    let endPercent = 0;

    // Make gradient for the day currently being processed
    let firstTaskDate = parseText(tasks[0])[0];
    if (firstTaskDate == '') {
      firstTaskDate = new Date(2000, 5, 5, 0, 5, 0); // Necessary if first task is at 0:00 in the morning
    }
    let nowTime = firstTaskDate;

    for (var n in tasks) {
      let parsedTxt = parseText(tasks[n]);
      taskDuration = parsedTxt[1];

      if (parsedTxt[0] != '') {
      // if (parsedTxt[0] != '' && Object.keys(trackTaskList).length != 0) {
        taskDate = parsedTxt[0];
        nowTime = new Date(taskDate.getTime());
        if (0 < n) {
          gradient += ', white ' + ' ' + Number(endPercent + 0.3) + '%, white ' + ' '
          + Number( parseInt((taskDate.getHours() * 60
          + taskDate.getMinutes()) / (24 * 60) * 100) - 0.3)  + '%';
        } else if (n == 0) {

          let key = parseText(tasks[0])[2].replace(/ /g, '_');
          if (trackTaskList[key]) {
            taskColour = trackTaskList[key][0];
          }
          startPercent = parseInt((taskDate.getHours() * 60 + taskDate.getMinutes()) / (24 * 60) * 100);
          endPercent = parseInt(startPercent + (taskDuration / 60000) / (24 * 60) * 100);

          gradient +=  startPercent + '% ' ;
        }
      } else {
        taskDate = nowTime;
      }

      nowTime = new Date(nowTime.getTime() + taskDuration);
      let taskText = parsedTxt[2];

      // Find the percent needed to be coloured (from startPercent to endPercent)

      startPercent = parseInt((taskDate.getHours() * 60 + taskDate.getMinutes()) / (24 * 60) * 100);
      endPercent = parseInt(startPercent + (taskDuration / 60000) / (24 * 60) * 100);


      // Find colour value if text is in trackTaskList
      let string = taskText;
      string = string.replace(/ /g, '_');

      taskColour = '#DED';  // Default task colour if not watched  #DED is dirtywhite with a green tinge

      for (var trackedTaskText in trackTaskList) {
        if (string == '') {
          taskColour = 'white'; // nullTime is made white
          break;
        } else if (string == trackedTaskText) {
          if (Number(trackTaskList[trackedTaskText][1]) === 1) { // If tracked ...
            taskColour = trackTaskList[trackedTaskText][0];
          }
          break;
        }
      }

      // Add to gradient and pad with black
      gradient += ', black ' + Number(startPercent - 0.2) + '%, ' + taskColour + ' ' + startPercent
      + '%, ' + taskColour + ' ' + Number(endPercent - 0.6)  + '%, '
      + 'black ' + Number(endPercent - 0.3)  + '%';

      taskColour = 'white';
    }

    gradient += ', white ' + endPercent + '%'; // Make the rest of the day white

    // Find button, set gradient and write to tooltip
    let button = document.getElementById(myId);
    if (button != null) {
      let buttonText = document.getElementById(myId).lastChild;
      button.setAttribute('style', 'background-image: linear-gradient(to right, ' + gradient + ')');
      // Set tool-tip to show the tasks of the day
      let children = button.childNodes;
      // let tasks = pastDayList[myId];
      if (tasks != '') {
        for (var task of tasks) {
          let isTracked = 0;
          let txt = parseText(task)[2].replace(/ /g, '_');
          if (txt == 'Day start' || txt == 'Day end') {
            continue;
          }

          if (txt in trackTaskList) {  // Makes sure it makes sense to look in trackTaskList
            isTracked = trackTaskList[txt][1];
          }

          if (dontShowTrackedAsTooltip && isTracked == 1) { // Skip writing task to tooltip if the flag is false. Flag is toggled in trackView by checkbox
            continue;
          }
          children[1].innerHTML += ' \u25CF ' + txt.replace(/_/g, ' ') + '&nbsp;' + '<br>'; // Write to tooltip
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

  // document.getElementById('monthContainer').scrollTop = 500;
  let monthContainer = document.getElementById('monthContainer');
  let scrollTop = monthContainer.scrollHeight - 2085; // 2085 is the pixel height of 3 monht in the future
  monthContainer.scrollTop = scrollTop;

  let now = new Date();
  if (now.getDate() == 5 && backupMessageShown == 0){
     displayMessage(languagePack['considerBackup'][language], 3000, 'month');
     backupMessageShown = 1;
  } else if (now.getDate() != 5) {
    backupMessageShown = 0;
  }
}


function putBack() {
  if (monthTaskList[putBackId]) { // If one or more is put back manually, put the rest back where they came from
    for (var item of tasksFromClickedDayInMonth) {
      monthTaskList[putBackId].push(item);
    }
  } else {
    monthTaskList[putBackId] = tasksFromClickedDayInMonth;
  }

  let chooseBox = document.getElementById('monthChooseBox');

  while (chooseBox.firstChild) {
    chooseBox.removeChild(chooseBox.lastChild);
  }

  chooseBox.classList.remove('active');
  document.getElementById('putBack').classList.remove('active');
  document.getElementById('moveToDay').classList.remove('active');

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

function gotoTrackFromMonth() {
  storeLocally();

  displayClass('monthView', false);
  displayClass('trackView', true);

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
    document.getElementById('taskPickerInputBox').focus();
  }

}


function colourButtonClicked(event) {
  let chosenColour = event.target.id;
  addTrackedTask(chosenColour);
}


function addTrackedTask(buttonColour) {
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

function selectAllOrNone() {
  let trackedChkboxes = document.getElementsByClassName('trackedTask');
  let allOrNone = document.getElementById('selectAllOrNoneChkbox');

  for (var el of trackedChkboxes) {
    el.checked = allOrNone.checked;
  }

  for (var trackedTask in trackTaskList) {
    let element = document.getElementsByClassName(trackedTask);
    // Set opacity according to checked status
    if (allOrNone.checked) {
      trackTaskList[trackedTask][1] = "1";
      element[0].style.opacity = 1;
      element[1].style.opacity = 1;
    } else {
      trackTaskList[trackedTask][1] = "0.25";
      element[0].style.opacity = 0.25;
      element[1].style.opacity = 0.25;
    }
  }
}

function trackCheckboxClicked(event) { // TODO: Is this actually used?
  let trackedTask = event.target.id;
  let element = document.getElementsByClassName(trackedTask);

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
  trackedItemCheckBox.classList.add('trackedTask');
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

  document.getElementById('trackedItemsDiv').appendChild(trackedItem);

  document.getElementById(item).addEventListener('click', function () { trackCheckboxClicked(event); });
}


function gotoMonthFromTrack() {
  displayClass('trackView', false);
  displayClass('monthView', true);
  monthRenderTasks();
}

function showOrHideTrackedTasksInTooltip() {
  dontShowTrackedAsTooltip = !document.getElementById('showTTChkbox').checked;
}


//////////////////// Track-view code above ^^^ ///////////////////////////

//////////////////// Storage-view code below ///////////////////////////

function gotoStorageFromDay() {
  storeLocally();

  displayClass('dayView', false);
  displayClass('storageView', true);

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
        location.hash = '#storageView_dayView';
        pushHashChangeToStack();
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
        storageList[id] = [deepCopyFunc(taskList), clickedButton.innerText];
      }
      else if (/^[^'!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']+$/.exec(text)) { // Sanitize input: only alpha numericals
        text = text.slice(0, 1).toUpperCase() + text.slice(1, );
        clickedButton.innerText = text;
        storageList[id] = [deepCopyFunc(taskList), text];
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
      setTimeout(function() {location.hash = '#storageView_dayView'; pushHashChangeToStack();}, 2000);

      // ... else get stuff
    } else if (clickedButton.classList.contains('inUse')) {
      storageList['trashBin'] = [deepCopyFunc(taskList), languagePack['restoreLast'][language]]; // Move current tasklist to trash bin

      taskList = deepCopyFunc(storageList[clickedButton.id][0]); // Let current tasklist be chosen stored tasklist
      taskList = fixDatesInList(taskList); // -- after dates are fixed...

      document.getElementById('trashBin').classList.add('inUse');
      document.getElementById('trashBin').classList.remove('notInUse');
      setTimeout(function() {location.hash = '#storageView_dayView'; pushHashChangeToStack();}, 2000); // timeout necessary for displayMessage to finish
      displayMessage(languagePack['retrieveFrom'][language][0] + clickedButton.innerText + languagePack['retrieveFrom'][language][1], 3000, 'day');
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

  displayClass('storageView', false);
  displayClass('dayView', true);

  renderTasks();
}

//////////////////// Storage-view code above ^^^ ///////////////////////////

//////////////////// Settings-view code below ///////////////////////////

// Used by an eventListener. Display settings.
function gotoSettingsFromDay() {
  // goToPage('settings.html')
  // Ligth/Dark theme?
  storeLocally();

  setUpSettings();

  displayClass('dayView', false);
  displayClass('settingsView', true);
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

  if (localStorage.wakeUpH && localStorage.wakeUpM) {
    let timeH = localStorage.wakeUpH;
    let timeM = localStorage.wakeUpM;
    // Check if leading zeroes are needed and add them
    let nils = ['', ''];
    if (timeH < 10) {
      nils[0] = '0';
    }
    if (timeM < 10) {
      nils[1] = '0';
    }

    let displayText = nils[0] + timeH + ':' + nils[1] + timeM;
    document.getElementById('inputBoxWakeUp').value = displayText;
  }
  if (localStorage.wakeUpStress) {
    document.getElementById('stressLevel').value = localStorage.wakeUpStress;
  }

  if (localStorage.tDouble) {
    document.getElementById('tDouble').value = localStorage.tDouble;
  }

  // if (localStorage.ticInterval) {
    //   document.getElementById('inputBoxX').value = localStorage.ticInterval;
    // }
    // if (localStorage.radioButtonResultAlarm) {
      //   document.getElementById(localStorage.radioButtonResultAlarm).checked = 'checked';
      // }
      // if (localStorage.radioButtonResultReminder) {
        //   document.getElementById(localStorage.radioButtonResultReminder).checked = 'checked';
        // }
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

  resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed

  location.hash = '#settingsView_dayView';
  pushHashChangeToStack();
}


function applyTaskDuration() {

  let min = document.getElementById('inputBoxM').value.trim();

  if (isNaN(min) || min < 0 || 24*60 - 2 < min) {
    displayMessage(languagePack['only0-1438'][language], 3000, 'settings');
    document.getElementById('inputBoxM').select();
    return;
  }

  defaultTaskDuration = min;
  localStorage.defaultTaskDuration = defaultTaskDuration;

  resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed

  location.hash = '#settingsView_dayView';
  pushHashChangeToStack();
}

function applyWakeUpTime() {
  [wakeUpH, wakeUpM] = readTimeBox('inputBoxWakeUp');

  document.getElementById('inputBoxWakeUp').value = wakeUpH + ':' + wakeUpM;

  localStorage.wakeUpH = wakeUpH;
  localStorage.wakeUpM = wakeUpM;

  adjustNowAndWakeUpButtons();

  resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed

  location.hash = '#settingsView_dayView';
  pushHashChangeToStack();
}


// function applyToc() {
//   let min = document.getElementById('inputBoxX').value.trim();
//
//   if (isNaN(min) || min < 0 || 59 < min) {
//     displayMessage(languagePack['only0-59'][language], 3000, 'settings');
//     document.getElementById('inputBoxX').select();
//     return;
//   }
//
//   localStorage.ticInterval = min;
//
//    let radioButtonResult1 = document.getElementsByClassName('alarm');
//    for (var i = 0; i < 4; i++) {
//      if (radioButtonResult1[i].type === 'radio' && radioButtonResult1[i].checked) {
//        localStorage.radioButtonResultAlarm = radioButtonResult1[i].value;
//      }
//    }
//
//    let radioButtonResult2 = document.getElementsByClassName('reminder');
//    for (var i = 0; i < 3; i++) {
//      if (radioButtonResult2[i].type === 'radio' && radioButtonResult2[i].checked) {
//        localStorage.radioButtonResultReminder = radioButtonResult2[i].value;
//      }
//    }
//
//    location.hash = '#settingsView_dayView';
//    pushHashChangeToStack();
//    // window.location.assign('main.html');
// }


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

  resetBackupButtons();  // Tidy up if a backup is in progress, but is overridden by this button being pressed

  location.hash = '#settingsView_dayView';
  pushHashChangeToStack();
}


function prepareStoreBackup() {
  document.getElementById('backup').hidden = true;
  document.getElementById('restoreBackup').hidden = true;

  document.getElementById('backupSection').hidden = false;
  let backupInputFixed = document.getElementById('backupInputFixed');
  backupInputFixed.hidden = false;
  document.getElementById('backupInput').hidden = false;

  // Make filename
  let now = new Date();
  let date = now.getDate().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getFullYear().toString();
  // backupFileName = 'FuzzyPlanBackup_' + date + '.fpbu';
  backupFileName = 'FuzzyPlanBackup_' + date + '.txt';
  backupInputFixed.value = backupFileName;
}


function resetBackupButtons() {
  document.getElementById('backup').hidden = false;
  document.getElementById('restoreBackup').hidden = false;

  document.getElementById('backupSection').hidden = true;
  document.getElementById('restoreBackupSection').hidden = true;
  document.getElementById('backupInput').value = '';
  document.getElementById('restoreBackupInput').value = '';

  backupFileName = '';
}


function fixBackupNameFromBrowsedNames() {
  let backupInput = document.getElementById('backupInput');

  if (backupInput.value != '') {
    backupFileName = backupInput.files[0].name;
  }

  document.getElementById('backupInputFixed').value = backupFileName;
}


function fixBackupNameFromWrittenName() {
  // backupFileName = document.getElementById('backupInputFixed').value + '.fpbu';
  backupFileName = document.getElementById('backupInputFixed').value + '.txt';
}


function confirmBackup() {
  // Wrap up data from localStorage in a blob
  let data = JSON.stringify(localStorage);
  // let data = JSON.stringify(localStorage.pastDayList);
  let blob = new Blob([data], { type: 'text/plain;charset=utf-8' });

  // Store the blob by creating a link element, clicking it and removing it again
  let url = window.URL.createObjectURL(blob);
  console.log(url);

  let element = window.document.createElement('a');
  element.href = url;
  element.download = backupFileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  // Clean up
  window.URL.revokeObjectURL(url);

  resetBackupButtons();
}


function restoreBackup() {
  document.getElementById('backup').hidden = true;
  document.getElementById('restoreBackup').hidden = true;

  document.getElementById('restoreBackupSection').hidden = false;

  document.getElementById('restoreBackupInput').addEventListener('change', readFile, false);
}


function readFile(event) {
  let file = event.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function(event) {
    pastDayListBackUp =  JSON.parse(event.target.result);
  }

  fixDatesInList(taskList); // Ensure that the taskList tasks is at the current date.

  reader.readAsText(file);
}

function confirmRestoreBackup() {
  if (document.getElementById('restoreBackupInput').value == '') {
    alert(languagePack['chooseABackup'][language]);
  } else {
    let answer = confirm(languagePack['sureYouWannaRestore?'][language]);
    if (answer) {
      for (item in pastDayListBackUp) {
        localStorage[item] = pastDayListBackUp[item];
      }

      location.reload();

    } else {
      alert(languagePack['nothingChanged'][language]);
    }

    document.getElementById('backup').hidden = false;
    document.getElementById('restoreBackup').hidden = false;

    document.getElementById('restoreBackupSection').hidden = true;
  }
}


function clearAllData() {
  let answer = confirm(languagePack['sureYouWannaClear?'][language]);
  if (answer) {
    taskList = [];
    localStorage.taskList = [];
    localStorage.monthTaskList = [];
    localStorage.pastDayList = [];
    clearDay();
    location.reload();
  } else {
    alert(languagePack['nothingWasDeleted'][language]);
  }
}


function clearEverything() {
  let answer = confirm(languagePack['reallySure?'][language]);
  if (answer) {
    localStorage.clear();
    location.reload();
  } else {
    alert(languagePack['nothingWasDeleted'][language]);
  }
}

function updateApp() {
  // Delete cached pages and ressources
  caches.delete('FP-cache');

  // Remove the current serviceworker
  navigator.serviceWorker.getRegistrations().then( function(registrations) {
    for (var registration of registrations) {
      registration.unregister();
    }
  });

  // // Fetch the serviceWorker again to reload pages and ressources into cache
  // navigator.serviceWorker.register('FuzzyPlan_serviceWorker20211002.js').then(function(registration) {
  //    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  //   }, function(err) {
  //      console.log('ServiceWorker registration failed: ', err);
  // });

  location.reload(true); // Before removing it I had trouble with using location.reload(true); in backupConfirm as it removed cached content

}


function gotoDayFromSettings() {
  storeLocally();
  displayClass('settingsView', false);
  displayClass('dayView', true);
  renderTasks();
}

//////////////////// Settings-view code above ^^^ ///////////////////////////

function swipeNavigationStart(event) {
  // console.log('Start   ',event.touches[0].screenX);
  sessionStorage.touchX = event.touches[0].screenX; // SESSIONstorage, not localStorage. Doh.
}


function swipeNavigationEnd(event) {
  // console.log('End ',event.changedTouches[0].screenX);

  let posDiff = event.changedTouches[0].screenX - sessionStorage.touchX;

  if (posDiff < 0 && 100 < Math.abs(posDiff)) { // Left swipe
    console.log('Left swipe?', posDiff  ) //, event.touches[0].screenX);
    if (location.hash == '#monthView_trackView') {
      location.hash = '#trackView_monthView';
      pushHashChangeToStack();
      return;
    }
    if (location.hash == '#trackView_monthView' || location.hash == '#dayView_monthView') {
      location.hash = '#monthView_dayView';
      pushHashChangeToStack();
      return;
    }
  } else if (0 < posDiff && 100 < Math.abs(posDiff)) { // Right swipe
    console.log('Right swipe?', posDiff);
    if (location.hash == '#settingsView_dayView' || location.hash == '#monthView_dayView') {
      location.hash = '#dayView_monthView';
      pushHashChangeToStack();
      return;
    }
    if (location.hash == '#trackView_monthView' || location.hash == '#dayView_monthView') {
      location.hash = '#monthView_trackView';
      pushHashChangeToStack();
      return;
    }
    if (location.hash == '#dayView_settingsView') {
      location.hash = '#settingsView_dayView';
      pushHashChangeToStack();
      return;
    }
    if (location.hash == '#dayView_storageView') {
      location.hash = '#storageView_dayView';
      pushHashChangeToStack();
    }

    sessionStorage.removeItem('touchX');
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
    newHeart.alt="heart symbol";

    heartSpan.appendChild(newHeart);
  }

  for (var i = 0; i < 10 - max; i++) {
    let newHalfHeart = document.createElement('img');
    newHalfHeart.src="200px-A_SVG_semicircle_heart_empty.svg.png";
    newHalfHeart.style.width = '14px';
    newHalfHeart.style.height = '14px';
    newHalfHeart.alt="empty heart symbol";

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
  if (taskList.length < 3) {
    let succes = false;
    let now = new Date();
    let taskStartMinusDst = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeUpH, wakeUpM);
    let taskStart = new Date(taskStartMinusDst.getTime());
    let task = new Task(taskStart, 15 * 60000, languagePack['planning'][language][0], 1);
    succes = addFixedTask(task);
    if (!succes) {
      console.log('wakeUpButton failed to insert a task');
    }
  }
  document.getElementById('nowButton').removeEventListener('click', nowButton, {once:true});
  document.getElementById('upButton').removeEventListener('click', wakeUpButton, {once:true});
  wakeUpOrNowClickedOnce = true;
  adjustNowAndWakeUpButtons();
}


// Used by an eventListener. Inserts a 15 min planning task at the current time
function nowButton() {
  if (taskList.length < 3) {
    let task = new Task(new Date(), 15 * 60000, languagePack['planning'][0][language], 1);
    addFixedTask(task);
  }
  document.getElementById('nowButton').removeEventListener('click', nowButton, {once:true});
  document.getElementById('upButton').removeEventListener('click', wakeUpButton, {once:true});
  wakeUpOrNowClickedOnce = true;
  adjustNowAndWakeUpButtons();
}


function adjustNowAndWakeUpButtons() {
  let min = '';

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
    document.getElementById('sortTask').classList.toggle('tasksToSort', false);  // Remove class tasksToSort due to 'false' flag
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
    // If text or emojis and no chosenTaskId
    if (chosenTaskId === '' && /[a-c, e-g, i-l, n-z, æ, ø, ǻ]/.exec(contentInputBox) != null ||  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.exec(contentInputBox) != null) {  // The latter is to allow emojis
      handleTaskInput(contentInputBox);
    } else { // Just numbers
      if (/[^0-9]/.exec(contentInputBox) != null && chosenTask != '') {
        // If there is a chosen task AND text it must be an error
        nullifyClick();
      } else if (contentInputBox === '') {
        null;
      } else if (/\d[0-5][0-9]/.exec(contentInputBox) != null || /[1-2]\d[0-5][0-9]/.exec(contentInputBox) != null) {
        // If there is 3-4 numbers, jump to the time indicated
        resetInputBox('day');
        jumpToTime(contentInputBox, true);
      } else { // Give up. Something stupid happened.
        console.log('inputAtEnter error. contentInputBox was ', contentInputBox);
        displayMessage(languagePack['formatReminder'][language], 6000, 'day')
        resetInputBox('day');
      }
    }
    // // Ready buttons for next task
    // button.textContent = languagePack['clearButton'][language][0];  // Black down-pointing small triangle
    // button.title = languagePack['clearButton'][language][1];
    fixClearButtonArrow();
    document.getElementById('addTaskButton').textContent = '+';
    document.getElementById('sortTask').classList.toggle('tasksToSort', false);  // Remove class tasksToSort due to 'false' flag
  } else {
    // Ready buttons for clearing or editing current text in inputbox
    button.textContent = languagePack['clearButtonText'][language][0]; // Black left-pointing small triangle
    button.title = languagePack['clearButtonText'][language][1];
    document.getElementById('addTaskButton').textContent = '\u270D';  // Writing hand
    document.getElementById('sortTask').classList.toggle('tasksToSort', true);  // Add class tasksToSort due to 'true' flag
  }
}

function handleTaskInput(contentInputBox) {
  let parsedList = parseText(contentInputBox);
  let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
  if (taskList.length == 2 && parsedList[0] == '') {
    displayMessage(languagePack['startWithFixed'][language], 5000, 'day');
  } else {
    let succes = addTask(uniqueIdOfLastTouched, task);

    if (!succes) {
      displayMessage(languagePack['notEnoughRoom'][language], 3000, 'day');
      document.getElementById('dayInputBox').value = contentInputBox;
    }
    wakeUpOrNowClickedOnce = true; // Inserting a fixed task remove the need to use upButton or nowButton to insert the first task
    document.getElementById('upButton').removeEventListener('click', wakeUpButton, {once:true}); // Remove eventlisteners sat by setUp via adjuistNowAndWakeUpButtons()
    document.getElementById('nowButton').removeEventListener('click', nowButton, {once:true});
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
    if (succes) {
      looseInputBoxFocus('day');
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
    if ((taskList[n].date <= task.date && task.date <= taskList[n].end) // If task start is in anoter task
      || (taskList[n].date <= task.end && task.end <= taskList[n].end) // Or if task end is
      || (task.date <= taskList[n].date && taskList[n].end <= task.end)) { // Or if the new task straddle an old task
        if (taskList[n].fuzzyness === 'isNotFuzzy') {
          overlap = 'hardOverlap';
          return overlap;
        } else {
          overlap = 'softOverlap';
        }
      }
      if (n === len - 1 && overlap === 'softOverlap') {
        return overlap;
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
  return overlappingTasks;
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
  anneal();
  renderTasks();
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
    document.getElementById('sortTask').classList.toggle('tasksToSort', false);  // Remove class tasksToSort due to 'false' flag
    id = '';
  }
  adjustNowAndWakeUpButtons();
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
  document.getElementById('sortTask').classList.toggle('tasksToSort', false);  // Remove class tasksToSort due to 'false' flag
  document.getElementById('dayInputBox').focus();
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
  for (var n=1; n<len; n++) {
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
  return displayList;
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
  msg = document.getElementById('message');
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
    if (chosenTaskId === '' && /[a-c, e-g, i-l, n-z]/.exec(contentInputBox) != null ||  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.exec(contentInputBox) != null) {  // The latter is to allow emojis
      let parsedList = parseText(contentInputBox);
      let task = new Task(parsedList[0], parsedList[1], parsedList[2], parsedList[3]);
      anneal();
      if (nullTimeClicked) {
        nullTimeClicked = false;
        let succes = addWhereverAfter(myUniqueId, task);  // Nulltimes shares id with the task before the nulltime
        if (!succes) {
          displayMessage(languagePack['notEnoughRoom'][language], 3000, 'day');
        }
      } else {
        addTaskBefore(myUniqueId, task);
      }

      // clearButton.textContent = languagePack['clearButton'][language][0]; // Black down-pointing small triangle
      // clearButton.title = languagePack['clearButton'][language][1];
      handleChoosebox('day');
      fixClearButtonArrow();

    } else {
      displayMessage(languagePack['formatReminder'][language], 6000, 'day')
    }
    document.getElementById('addTaskButton').textContent = '+';
    if (!document.getElementById('dayChooseBox').classList.contains('active')) {
      document.getElementById('sortTask').classList.toggle('tasksToSort', false); // Remove class tasksToSort due to 'false' flag
    }

  } else if (contentInputBox !== '' && chosenTaskId) {
    // Text in inputbox and a chosenTaskId. Should not happen.
    nullifyClick();
    console.log('Text in inputbox and a chosenTaskId. Should not happen.');

  }  else if (contentInputBox == '' && !chosenTaskId) {
    // No text in inputBox and no chosenTaskId: Getting ready to edit or delete
    chosenTask = document.getElementById(myUniqueId);
    let myId = getIndexFromUniqueId(myUniqueId);
    taskList[myId].isClicked = 'isClicked';
    chosenTaskId = chosenTask.id;
    uniqueIdOfLastTouched = chosenTaskId;

    if ((nullTimeClicked && document.activeElement.id == 'dayInputBox')
    || (!nullTimeClicked && document.activeElement.id != 'dayInputBox')) {
      document.getElementById('dayInputBox').blur();
    } else {
      document.getElementById('dayInputBox').focus();
    }

  } else if (contentInputBox == '' && chosenTaskId) {
    // No text in inputBox and a chosenTaskId: Swap elements - or edit if the same task is clicked twice
    if (/[n]/.exec(myUniqueId) != null) {  // If nulltime ...
      // displayMessage('Unasigned time can not be edited', 3000);  // More confusing than helpful(?) Yep. Need clean up.
    } else if (chosenTaskId === myUniqueId) {
      editTask();
      document.getElementById('addTaskButton').textContent = '\u270D';  // Writing hand
      document.getElementById('sortTask').classList.toggle('tasksToSort', true);
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

  let nextToLastIndex = 0;
  let len = taskList.length;
  for (const [index, task] of taskList.entries()) {
    if (task.uniqueId.toString() === uniqueId.toString()) {
      return index;
    }
    if (index == len - 2) { // Store the next to last index in case no uniqueId is found
      nextToLastIndex = index;
    }
  }
  return nextToLastIndex; // If no uniqueId is found, return next to last index in list
}


function swapTasks(myId) {
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


function anneal() {
  fixTimes();
  let len = taskList.length;
  for (var n=1; n<len - 1; n++) {
    if (taskList[n + 1].date < taskList[n].end) {
      [taskList[n], taskList[n + 1]] = [taskList[n + 1], taskList[n]];
      fixTimes();
    }
    if (0 < taskList[n + 1].date - taskList[n].end && taskList[n + 1].fuzzyness === 'isFuzzy') {
      taskList[n + 1].date = taskList[n].end;
      taskList[n + 1].end = new Date(taskList[n + 1].date.getTime() + taskList[n + 1].duration);
    }
  }
  fixTimes();

  overspill = fixOverspillingTasks();
  if (overspill) {
    fillChooseBox('day');
    displayMessage(languagePack['taskPastEndOfDay'][language][0], 3000, 'day');
  }
}


function fixOverspillingTasks() {
  // Send tasks overspilling at the end of the day to chooseBox
  let overspill = false;
  let len = taskList.length;

  if (taskList[len - 1].text != 'Day end') {
    let dayEndPos = 1;
    for (var n=1; n<len - 1; n++) {
      if (taskList[n].text == 'Day end') {
        dayEndPos = n;
        break;
      }
    }

    tasksSentToDay.push('dummy'); // Ugly hack to prevent handleChooseBox in taskHasBeenClicked eating relevant tasks

    for (var m=dayEndPos + 1; m<len; m++) {
      tasksSentToDay.push(taskList[m]);
      overspill = true;
    }

    for (var m=dayEndPos + 1; m<len; m++) {
      taskList.pop();
    }
    fixOverspillingTasks();
  }

  // Check if there is a task straggling Day End
  let nextLast = taskList[taskList.length - 2];
  if (taskList[taskList.length - 1].date.getTime() < nextLast.date.getTime() + nextLast.duration) {
    tasksSentToDay.push(nextLast);
    taskList.splice(taskList.length - 2, 1);
    len -= 1;
    overspill = true;
  }

  return overspill;
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
      // console.log(n, 'Overlapping a fixed task'); // TODO: A fuzzy task can be pushed into overlapping a fixed task
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
  let now = new Date();
  let hours = (now.getHours() - 1).toString();
  let minutes = now.getMinutes().toString();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let nowMinusOneHour = hours + minutes;
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
      displayMessage(languagePack['numberNotRecognized'][language], 1000, 'day');
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
    let text1 = nils[0] + timeH + ':' + nils[1] + timeM + '-';
    text = text1 + nils[2] + endH + ':' + nils[3] + endM + ' ' + text;
  }

  return text;
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
  if (!rawText) {
    rawText = '';
  }

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
    time = time[0].toString();
    time = time.toString().replace(':', '');

    if (time.length == 4) {
      timeH = /[0-9][0-9]/.exec(time).toString();
    } else if (time.length == 3) {
      timeH = /[0-9]/.exec(time).toString();
    }

    time = time.replace(timeH, '');
    timeM = /[0-9][0-9]/.exec(time).toString();
    if (rawText.includes(':')) {
      rawText = rawText.replace(timeH + ':' + timeM, '');
    } else {
      rawText = rawText.replace(timeH + timeM, '');
    }
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
  };

  let gain = /g+[-]*[1-5]+/.exec(rawText); // Gain counts double as the assumption is consious relaxation
  if (/g+[-]*[1-5]+/.exec(gain)) {
    gain = /[-]*[1-5]/.exec(gain).toString();
    drain = '-' + gain;
    rawText = rawText.replace('g' + gain, '');
  };

  if (drain == 1) {
    if (rawText.toLowerCase().includes(languagePack['pause'][language])) {drain = '-1'};
    if (rawText.toLowerCase().includes(languagePack['rest'][language])) {drain = '-3'};
    if (rawText.toLowerCase().includes(languagePack['relax'][language])) {drain = '-5'};
    if (rawText.toLowerCase().includes(languagePack['meditate'][language])) {drain = '-5'};
    if (rawText.toLowerCase().includes(languagePack['splatte'][language])) {drain = '-5'};
  }

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

  if (localStorage.indexOfLastTouched) {
    uniqueIdOfLastTouched = taskList[localStorage.indexOfLastTouched].uniqueId;
  } else {
    uniqueIdOfLastTouched = 0;
  }
}

// For debugging only:
function showTaskListTimes() {
  let len = taskList.length;
  for (var n=0; n<len; n++) {
    console.log(n, 'Start:', taskList[n].date.getHours(), taskList[n].date.getMinutes(), 'End: ', taskList[n].end.getHours(), taskList[n].end.getMinutes(), taskList[n].text);
  }
}

// For debugging tasksSentToDay in the browser:
// rap = monthTaskList['15-4-2021']; monthTaskList['12-4-2021'] = rap; monthRenderTasks()
