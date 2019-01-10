import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { units } from "user-settings";
import * as util from "../common/utils";
import { goals } from "user-activity";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { display } from "display";
import * as fs from "fs";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import * as weekday from "../common/weekday"
import { locale } from "user-settings";

clock.granularity = "minutes";

let screenshotMode = false;

var dateFormat = "DD.MM";
var distanceUnit = "m";
var language = "en"
var isShowStepsProgress = true;
var isShowDistanceUnit = false;

let getProgressEl = function(prefix) {  
  let containerEl = document.getElementById(prefix);
  return {
    prefix: prefix,
    prevProgressVal: null,
    container: containerEl,
    progress: containerEl.getElementsByClassName("progress")[0],
    count: containerEl.getElementsByClassName("count")[0],
    icon: containerEl.getElementsByClassName("icon")[0],
    tgtYes: containerEl.getElementsByClassName("tgt-yes")[0],
    tgtNo: containerEl.getElementsByClassName("tgt-no")[0]
  }
}

let goalTypes = [
  "steps",
  "distance",
  "elevationGain",
  "calories",
  "activeMinutes"
];

let getCurrentStepsOnHourStart = function() {
  let now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    // workaround for a hypothetically possible race condition at 00:00
    return 0;
  }
  return today.local["steps"] || 0;
}

let progressEls = [];

let stepsByMinute = [];
var stepsOnHourStart = getCurrentStepsOnHourStart();

var getNextHourStartsInMs = function() {
  let now = new Date();
  return 3600001 - now.getMinutes() * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();
}

var stepsProgressTimeout = null;

var updateStepsOnHourStartAndScheduleNextUpdate = function() {
  clearTimeout(stepsProgressTimeout); 
  stepsOnHourStart = getCurrentStepsOnHourStart();
  resetProgressPrevState();
  drawAllProgress();
  stepsProgressTimeout = setTimeout(updateStepsOnHourStartAndScheduleNextUpdate, getNextHourStartsInMs()); 
}

let initStepsProgressUpdates = function() { 
  if (!stepsProgressTimeout) {
    updateStepsOnHourStartAndScheduleNextUpdate();
  }
}

let clearStepsProgressUpdates = function() {
  clearTimeout(stepsProgressTimeout);  
  stepsProgressTimeout = null;
}

for (var i=0; i < goalTypes.length; i++) {
  var goalType = goalTypes[i];
  progressEls.push(getProgressEl(goalType)); 
}  

let root = document.getElementById('root')
const screenHeight = root.height //250 - Ionic, 300 - Versa
const screenWidth = root.width

let isLongScreen = screenHeight >= 300;

if (!isLongScreen) {
  progressEls[4].container.style.display = "none";
}

let timeEl = document.getElementById("time");
let dateEl = document.getElementById("date"); 

let hrEl = document.getElementById("hr");
let hrIconSystoleEl = document.getElementById("hr-icon-systole");
let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");

let hrCountEl = document.getElementById("hr-count");

let batContainerEl = document.getElementById("bat");
let batEl = document.getElementById("bat-count");
let batFillEl = document.getElementById("bat-fill");
let batShellEl = document.getElementById("bat-shell");
let batBody = document.getElementById("bat-body");

let root = document.getElementById('root')
let backgroundEl = document.getElementById('background')
let screenHeight = root.height
let screenWidth = root.width

let progressWidth = progressEls[0].container.getElementsByClassName("bg")[0].getBBox().width;
let batFillWidth = batBody.width - 4;

let getStepsProgress = function(stepsCurrent) {
  if (screenshotMode) {
    return 312;
  }
  return Math.max(0, stepsCurrent - stepsOnHourStart);
}

let getDistanceDisplayValue = function(actual) {
  var displayValue = actual;
    if (screenshotMode) {
      displayValue = "6.51";
    } else if (distanceUnit === "km") {
      displayValue = (actual / 1000.).toPrecision(3);
    } else if (distanceUnit === "ft") {
      displayValue = Math.round(actual * 3.2808);      
    } else if (distanceUnit === "mi") {
      displayValue = (actual / 1609.344).toPrecision(3);      
    } else if (distanceUnit === "yd") {
      displayValue = Math.round(actual * 1.0936);      
    }   
  
    if (isShowDistanceUnit) {
      displayValue = displayValue + " " + distanceUnit;
    }
    return displayValue;
}

let getStepsDisplayValue = function(actual) { 
  if (isShowStepsProgress) {   
    let stepsProgress = getStepsProgress(actual);    
    return actual + " +" + stepsProgress;    
  } else {
    return actual;
  }
}

let drawProgress = function(progressEl) {
  let prefix = progressEl.prefix;
  
  let actual = (today.local[prefix] || 0);
  if (progressEl.prevProgressVal == actual) {
    return;
  }  
  progressEl.prevProgressVal = actual;
  
  let goal = (goals[prefix] || 0);
 
  var progress = 0;
  if (goal > 0) {
    progress = 100.* actual / goal;
  }
  
  if (screenshotMode) { 
    progress = 55 + 66 * Math.random();
  }
     
  var isGoalReached = false;
  
  if (progress >= 100) {
    progress = 100;
    isGoalReached = true;
    progressEl.tgtYes.style.display = "inline";
    progressEl.tgtNo.style.display = "none";
  } else {
     progressEl.tgtYes.style.display = "none";
     progressEl.tgtNo.style.display = "inline";
  }
  
  progressEl.progress.width =  Math.floor(progressWidth * progress / 100);  
  
  var displayValue = actual;
  if (prefix === "distance" && actual) {    
    displayValue = getDistanceDisplayValue(actual);
  } else if (prefix === "steps" && actual) {    
    displayValue = getStepsDisplayValue(actual);
  }
  progressEl.count.text = displayValue;
}

let drawTime = function(now) {

  var hours = now.getHours();
  var amPm = "";
  if (preferences.clockDisplay === "12h" || isAmPm || screenshotMode) {
    // 12h format    
    if (isAmPm) {
      if (hours < 12) {
        amPm = " AM";
      } else {
        amPm = " PM";
      }
    }
    
    hours = hours % 12 || 12;    
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(now.getMinutes());
  
  timeEl.text = `${hours}:${mins}${amPm}`;
  
  if (screenshotMode) {
     timeEl.text = "08:17"
  }
  
  let day = now.getDate();
  let monthIndex = now.getMonth() + 1;
  
  let dayName = weekday.getWeekdayName(language, now.getDay());

  var dateText;  

  if (dateFormat == "DD.MM") {
    dateText= ", " + util.zeroPad(day) + "." + util.zeroPad(monthIndex);    
  } else {
    dateText= ", " + util.zeroPad(monthIndex) + "." + util.zeroPad(day);
  }
  if (screenshotMode) {
    dateText = ", 03.05"
  }
  dateEl.text =  dayName +  dateText;
}

var drawAllProgress = function() {
  for (var i=0; i < goalTypes.length; i++) {  
    drawProgress(progressEls[i]);
  }
}

var resetProgressPrevState = function() {
  for (var i=0; i < goalTypes.length; i++) {  
    progressEls[i].prevProgressVal = null;
  }
}

let hrm = new HeartRateSensor();

var isAmPm = false;

var hrmAnimationPhase = false;

var prevHrmRate = null;

var hrmRate = null;

var hrAnimatedInterval = null;

var isFastProgress = false;
var fastProgressInterval = null;
let initFastProgressInterval = function() {
  clearInterval(fastProgressInterval);
  fastProgressInterval = setInterval(drawAllProgress, 5000);
}

let hideHr = function() {
   hrmRate = null;
   prevHrmRate = null;   
   stopHrAnimation();
   hrEl.style.display = "none";
}

let showHr = function() {  
  // updating HRM readings
  hrmRate = hrm.heartRate;
  if (hrmRate && display.on) {
    // displaying HRM readings
    hrCountEl.text = hrmRate;  
    if (!prevHrmRate) {
      //this is the first showHr() call after hideHr() - showing the element and starting the animation
      hrEl.style.display = "inline";    
      animateHr();
    }
  } else {
    hideHr();
  }
}

let initHrInterval = function() {
  clearInterval(hrAnimatedInterval);
  hrAnimatedInterval = setInterval(animateHr, 30000/hrmRate);
}

let stopHrAnimation = function() {
  clearInterval(hrAnimatedInterval);
  hrIconDiastoleEl.style.display = "inline";
}

let animateHr = function() {   
    //animating a single systole or diastole depending on the animation phase
    if (hrmAnimationPhase) {
      hrIconDiastoleEl.style.display = "none";
    } else {
      hrIconDiastoleEl.style.display = "inline";  
    }  
    hrmAnimationPhase =!hrmAnimationPhase;
  
    if (prevHrmRate != hrmRate) {
      //HRM readings have been changed: need to ajust and restart animation interval
      clearInterval(hrAnimatedInterval);      
      prevHrmRate = hrmRate;
      initHrInterval();      
    }     
    prevHrmRate = hrmRate;
}

hrm.onreading = showHr;
hrm.start();

let drawBat = function() {
  let level = battery.chargeLevel;
  batEl.text = Math.floor(level)
  batFillEl.width = batFillWidth - Math.floor(batFillWidth * level / 100.)
}

let applyState = function() {
  if (display.on) {    
    hrm.start();
    if (isFastProgress) {      
      initFastProgressInterval()
    } else {
      clearInterval(fastProgressInterval);
    }
    if (!hrmRate) {
      hideHr()    
    }
    drawAllProgress();
  } else {
    hrm.stop();
    hideHr();    
    clearInterval(fastProgressInterval);
  }  
}

display.onchange = applyState;

clock.ontick = (evt) => {  
  let now = evt.date;
  drawTime(now); 
  drawAllProgress();
  drawBat();
}

// SETTINGS
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = screenshotMode ? "settingsVS.cbor":"settingsV1.cbor";

let settings = loadSettings();

let applySettings = function() {
  if (! settings) {
   return;
  }
  
  try {
      dateFormat = (settings.hasOwnProperty("dateFormat") && settings.dateFormat.values) ? settings.dateFormat.values[0].value : "DD.MM";
      distanceUnit = (settings.hasOwnProperty("distanceUnit") && settings.distanceUnit.values) ? settings.distanceUnit.values[0].value : "m";

      language = (settings.hasOwnProperty("language") && settings.language.values) ? settings.language.values[0].value : "en";
    
    if (settings.hasOwnProperty("timeColor") && settings.timeColor) {
      timeEl.style.fill = settings.timeColor;
    }

    if (settings.hasOwnProperty("dateColor") && settings.dateColor) {
      dateEl.style.fill = settings.dateColor;
    }

    if (settings.hasOwnProperty("isFastProgress")) {
      isFastProgress = !!settings.isFastProgress;    
    }    
    
    if (settings.hasOwnProperty("isShowStepsProgress")) {
      isShowStepsProgress = !!settings.isShowStepsProgress;
    } 
    
    if (isShowStepsProgress) {
      initStepsProgressUpdates();
    } else {
      clearStepsProgressUpdates();
    }
     
    if (settings.hasOwnProperty("isShowDistanceUnit")) {
      isShowDistanceUnit = !!settings.isShowDistanceUnit; 
    }   
    
    if (settings.hasOwnProperty("isAmPm")) {
      isAmPm = !!settings.isAmPm; 
    }       

    if (settings.hasOwnProperty("otherLabelsColor") && settings["otherLabelsColor"]) {
       var otherLabelsColor = settings["otherLabelsColor"];
       root.style.fill = otherLabelsColor;      
    }

    if (settings.hasOwnProperty("backgroundColor") && settings["backgroundColor"]) {
       var backgroundColor = settings["backgroundColor"];
       backgroundEl.style.fill = backgroundColor;     
       batFillEl.style.fill = backgroundColor;
    }

    if (settings.hasOwnProperty("heartColor") && settings["heartColor"]) {
       var heartColor = settings["heartColor"];
       hrIconDiastoleEl.style.fill = heartColor;
       hrIconSystoleEl.style.fill = heartColor;         
    }

    for (var i=0; i < goalTypes.length; i++) {
      var goalTypeProp = goalTypes[i] + "Color";
      if (settings.hasOwnProperty(goalTypeProp) && settings[goalTypeProp]) {
        progressEls[i].container.style.fill = settings[goalTypeProp];
      }
    }
    resetProgressPrevState();
    applyState();
  } catch (ex) {
    console.log(ex);
  }
}

applySettings();

let onsettingschange = function(data) {
  if (!data) {
   return;
  }
  settings = data;
  applySettings();
  drawTime(new Date());
}

messaging.peerSocket.addEventListener("message", function(evt) {
  if (!settings) {
    settings = {};
  }
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
})

appbit.addEventListener("unload", saveSettings);

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.log(ex);
    var defaults = {
      isShowStepsProgress: true,
      isFastProgress: false,
      language: 'en'
    };    
    
    if (units.distance === "us") {
      defaults["distanceUnit"] = { values:[{value:"mi"}]};
      defaults["dateFormat"] = { values:[{value:"MM.DD"}]}; 
    }   
    return defaults;
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
