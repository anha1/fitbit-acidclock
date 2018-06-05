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

clock.granularity = "minutes";

let weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

let screenshotMode = false;

var dateFormat = "DD.MM";
var distanceUnit = "m";

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
  "calories"
];

let progressEls = [];

for(var i=0; i < goalTypes.length; i++) {
  var goalType = goalTypes[i];
  progressEls.push(getProgressEl(goalType)); 
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

let progressWidth = progressEls[0].container.getElementsByClassName("bg")[0].width;
let hrIconX = hrIconEl.x;
let batFillWidth = batBody.width - 4; 

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
    progress = 66 + 100*Math.random();
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
    
    if(screenshotMode) {
      displayValue = "6.51";
    } else if (distanceUnit === "km") {
      displayValue = (actual / 1000.).toPrecision(3);
    } else if (distanceUnit === "ft") {
      displayValue = Math.round(actual * 3.2808);      
    } else if (distanceUnit === "mi") {
      displayValue = (actual / 1609.344).toPrecision(3);      
    }
  }  
  progressEl.count.text = displayValue;
}

let drawTime = function(now) {

  var hours = now.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(now.getMinutes());
  timeEl.text = `${hours}:${mins}`;
  
  if(screenshotMode) {
     timeEl.text = "08:17"
  }
  
  let day = now.getDate();
  let monthIndex = now.getMonth() + 1;
  
  let dayName = weekday[now.getDay()];

  var dateText;  

  if (dateFormat == "DD.MM") {
    dateText= ", " +util.zeroPad(day) + "." + util.zeroPad(monthIndex);    
  } else {
    dateText= ", " +util.zeroPad(monthIndex) + "." + util.zeroPad(day);
  }
  if (screenshotMode) {
    dateText = ", 03.05"
  }
  dateEl.text =  dayName +  dateText;
}

var drawAllProgress = function() {
  for(var i=0; i < goalTypes.length; i++) {  
    drawProgress(progressEls[i]);
  }
}

let hrm = new HeartRateSensor();

var isHeartbeatAnimation=true;
var hrmAnimationCounter = 0;

var prevHrmRate = null;

var hrmRate = null;

var hrAnimated = false;
var hrAnimatedInterval = null;
let initHrInterval = function() {
  clearInterval(hrAnimatedInterval);
  hrAnimatedInterval = setInterval(animateHr, 30000/hrmRate);
}

var isFastProgress = false;
var fastProgressInterval = null;
let initFastProgressInterval = function() {
  clearInterval(fastProgressInterval);
  fastProgressInterval = setInterval(drawAllProgress, 5000);
}

let stopHrAnimation = function() {
  hrAnimated = false;
  clearInterval(hrAnimatedInterval);
  hrIconDiastoleEl.style.display = "inline";
}

let hideHr = function() {
   hrmRate = null;
   prevHrmRate = null;   
   stopHrAnimation();
   hrEl.style.display = "none";
}

let animateHr = function() {   
    if (hrmAnimationCounter++ % 2 ==0) {
      hrIconDiastoleEl.style.display = "none";
    } else {
      hrIconDiastoleEl.style.display = "inline";  
    }
    if (prevHrmRate != hrmRate) {
      clearInterval(hrAnimatedInterval);
      if (isHeartbeatAnimation) {
        prevHrmRate = hrmRate;
        initHrInterval();
      }
    }     
    prevHrmRate = hrmRate;
}

let drawHrm = function() {  
  hrmRate = hrm.heartRate;
  if (hrmRate && display.on) {
    hrCountEl.text = hrmRate;  
    if (!prevHrmRate) {
      hrEl.style.display = "inline";    
    }
    if(!hrAnimated && isHeartbeatAnimation) {
      clearInterval(hrAnimatedInterval);   
      prevHrmRate = hrmRate;
      initHrInterval();
      hrAnimated = true;      
    }
  } else {
    hideHr();
  }
}

drawHrm();
hrm.onreading = drawHrm;
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
    } else if(!isHeartbeatAnimation) {
      stopHrAnimation();
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
  drawTime(evt.date); 
  drawAllProgress();
  drawBat();  
}

// SETTINGS
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settingsV1.cbor";

let settings = loadSettings();

let applySettings = function() {
  if (! settings) {
   return;
  }
  
  try {
    dateFormat = (settings.hasOwnProperty("dateFormat") && settings.dateFormat.values) ? settings.dateFormat.values[0].value : "DD.MM";
    distanceUnit = (settings.hasOwnProperty("distanceUnit") && settings.distanceUnit.values) ? settings.distanceUnit.values[0].value : "m";

    if (settings.hasOwnProperty("timeColor") && settings.timeColor) {
      timeEl.style.fill = settings.timeColor;
    }

    if (settings.hasOwnProperty("dateColor") && settings.dateColor) {
      dateEl.style.fill = settings.dateColor;
    }

    if (settings.hasOwnProperty("isFastProgress")) {
      isFastProgress = !!settings.isFastProgress;    
    }

    if (settings.hasOwnProperty("isHeartbeatAnimation")) {
      isHeartbeatAnimation = !!settings.isHeartbeatAnimation; 
    }       

    if(settings.hasOwnProperty("otherLabelsColor") && settings["otherLabelsColor"]) {
       var otherLabelsColor = settings["otherLabelsColor"];
       root.style.fill = otherLabelsColor;      
    }

    if(settings.hasOwnProperty("backgroundColor") && settings["backgroundColor"]) {
       var backgroundColor = settings["backgroundColor"];
       backgroundEl.style.fill = backgroundColor;     
       batFillEl.style.fill = backgroundColor;
    }

    if(settings.hasOwnProperty("heartColor") && settings["heartColor"]) {
       var heartColor = settings["heartColor"];
       hrIconDiastoleEl.style.fill = heartColor;
       hrIconSystoleEl.style.fill = heartColor;         
    }

    for(var i=0; i < goalTypes.length; i++) {
      var goalTypeProp = goalTypes[i] + "Color";
      if(settings.hasOwnProperty(goalTypeProp) && settings[goalTypeProp]) {
        progressEls[i].container.style.fill = settings[goalTypeProp];
      }
    }
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
      isHeartbeatAnimation: true,
      isFastProgress: false,
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
