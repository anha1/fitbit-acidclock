import clock from "clock";
import document from "document";
import { units } from "user-settings";
import { goals } from "user-activity";
import { today } from "user-activity";
import { display } from "display";
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { me as device } from "device";
import { Settings } from "../common/settings";
import { MODE } from "../common/mode";
import { logInfo, logError } from "../common/log";
import { StepsProgress } from "./steps-progress";
import { HrmAnimation } from "./hrm-animation";
import { ProgressIndicators }  from "./progress-indicators"
import { BatteryIndicator }  from "./battery-indicator"
import { TimeIndicator }  from "./time-indicator"
import { CryptoIndicator } from "./crypto-indicator"
import { BluetoothIndicator } from "./bluetooth-indicator"
import { ExerciseIndicator } from "./exercise-indicator"
import { Background } from "./background"
import { locale } from "user-settings";
import { vibration } from "haptics";
import { Barometer } from "barometer";
import { inbox } from "file-transfer";

clock.granularity = "minutes";

let root = document.getElementById('root');

const screenHeight = root.height //250 - Ionic, 300 - Versa
const screenWidth = root.width
let isLongScreen = screenHeight >= 300; //Versa and possible future devices
let isElevation = !! Barometer; //Versa lite does not have it

const SETTINGS_FILE = isElevation ? "settingsV1.cbor" : "settingsV1lite.cbor";

let settings = new Settings(SETTINGS_FILE, function() {
  var defaults = {
    isShowStepsProgress: true,
    isBluetoothIndicator: true,
    language: 'en',
    dateFormat: "DD.MM",
    distanceUnit: "m",
    isShowDistanceUnit: true,
    isShowSeconds: false,
    isVibrationOnCcErRefresh: true,
    isAmPm: true,
    is12hourClock: false,
    isGps: true,
    goal0: "steps",
    goal1: "distance",
    goal2: "elevationGain",
    goal3: "calories",
    goal4: "activeMinutes",
    currencyCc: "USD"
  };
  if (units.distance === "us") {
    defaults.distanceUnit = "mi";
    defaults.dateFormat = "MM.DD"; 
  }   
  if (!isElevation) {
    defaults.goal2 = "calories";
    defaults.goal3 = "activeMinutes";
    defaults.goal4 = "NONE";
  }  
  if (!isLongScreen) {
    defaults.goal4 = "NONE";
  }  
  return defaults;
});

let stepsProgress = new StepsProgress( 
  function() {
    progressIndicators.forceDrawAllProgress();
  }, function() {  
    return today.local["steps"] || 0;
  }
);

let isCryptoMode = function() {
  return MODE.isForceCryptoMode || settings.isTrue("isShowCc"); 
}

let isCryptoOnShortScreen = function() {
  // Ionic workaround: no space to show both CC and Bluetooth status / exercises
  return !isLongScreen && isCryptoMode();
}

let progressIndicators = new ProgressIndicators(document, settings, stepsProgress);

let hrmAnimation = new HrmAnimation(document, settings);

let batteryIndicator = new BatteryIndicator(document);

let timeIndicator = new TimeIndicator(document, settings);

let cryptoIndicator = new CryptoIndicator(document, settings, isLongScreen);

let exerciseIndicator = new ExerciseIndicator(document, settings, function() {
  if (isCryptoOnShortScreen()) { 
    cryptoIndicator.refreshUi();
  }
  timeIndicator.drawTime(new Date());
})

let background = new Background(document, settings);

let bluetoothIndicator = new BluetoothIndicator(document, settings, isCryptoOnShortScreen);

var isBackgroundImageMode = background.tryRecoverImage("black");

let applyState = function() {
  if (display.on) {        
    hrmAnimation.start();
    bluetoothIndicator.draw();
    hrmAnimation.hideIfNoReadings();
    progressIndicators.drawAllProgress();
    cryptoIndicator.refreshUi();
    cryptoIndicator.fetchIfStale();
    bluetoothIndicator.draw();
    batteryIndicator.draw();
    exerciseIndicator.applyState();
  } else {
    hrmAnimation.stop();
    exerciseIndicator.stopRefresh();
  }  
}

display.onchange = function() {
  applyState();
}

clock.ontick = (evt) => {
  let now = evt.date;
  timeIndicator.drawTime(now); 
  applyState();
}

let applySettings = function() {
  if (! settings) {
    return;
  }  
  try {
    settings.ifPresent("timeColor", timeIndicator.setTimeColor);
    
    settings.ifPresent("dateColor", timeIndicator.setDateColor);

    if (settings.isTrue("isShowStepsProgress")) {
      stepsProgress.initUpdates();
    } else {
      stepsProgress.clearUpdates();
    }
    
    if (settings.isTrue("isShowSeconds")) {
      clock.granularity = "seconds";
    } else {
      clock.granularity = "minutes";
    }

    var newGoalTypes = [
      settings.getOrElse("goal0", "steps"),
      settings.getOrElse("goal1", "distance"),
      settings.getOrElse("goal2", "elevationGain"),
      settings.getOrElse("goal3", "calories"),
      settings.getOrElse("goal4", "activeMinutes")      
    ];
    
    if (isLongScreen) {
      if (isCryptoMode()) {
        newGoalTypes[4] = "NONE";
        cryptoIndicator.initUpdates();
      } else {
        cryptoIndicator.clearUpdates();
      }
    } else {
      newGoalTypes[4] = "NONE";
      if (isCryptoMode()) {
        newGoalTypes[3] = "NONE";
        cryptoIndicator.initUpdates();
      } else {
        cryptoIndicator.clearUpdates();
      }
    }
    
    cryptoIndicator.refreshUi();
        
    settings.ifPresent("otherLabelsColor", function(otherLabelsColor) {
      root.style.fill = otherLabelsColor;
      exerciseIndicator.setColor(otherLabelsColor);
    });
 
    let backgroundColor = settings.getOrElse("backgroundColor", "black");    
    
    if (isBackgroundImageMode) {
      isBackgroundImageMode = background.tryRecoverImage(backgroundColor);
    } else { 
      background.setColor(backgroundColor);   
    } 

    settings.ifPresent("heartColor", hrmAnimation.setColor);   
    
    settings.ifPresent("ccLogosColor", cryptoIndicator.setLogosColor);
    
    hrmAnimation.onSettingsChange();
            
    progressIndicators.applyGoalTypeSettings(newGoalTypes);
    exerciseIndicator.applyGoalTypeSettings(newGoalTypes);
    progressIndicators.forceDrawAllProgress();
    applyState();
    logInfo("Settings applied");
  } catch (ex) {
    logError(ex);
  }
}

applySettings();

let doCcErFeedback = function() {
  if (display.on && (settings.isTrue("isVibrationOnCcErRefresh") || MODE.isForceCryptoMode)) {
    vibration.start("bump");
  }
}

messaging.peerSocket.addEventListener("message", function(evt) {  
  if (!evt.data.hasOwnProperty("type")) {
    logInfo("Message without a type received: " + evt.data)
  }
  if (evt.data.type === "settings") {
    logInfo("Settings received");
    let newSettingsSource = {};  
    newSettingsSource[evt.data.key] = evt.data.value;
    logInfo(evt.data.key);
    if (evt.data.key == "backgroundColor") {
      logInfo("Background color selected, resetting image");
      isBackgroundImageMode = false;
    }
    
    settings.replaceSettings(newSettingsSource);
    applySettings();
    timeIndicator.drawTime(new Date());
  }
  if (evt.data.type === "CCER") {
    logInfo("Cryptocurrency exchange rate message has been received by the device");
    doCcErFeedback();
    cryptoIndicator.onResponse(evt.data);
  }
})


let prevManualRefresh = null;

root.onclick = function(e) {
  if (isCryptoMode() && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {      
      let now = (new Date()).getTime(); 
      if (prevManualRefresh) {
        let refreshDiff = now - prevManualRefresh;
        if (refreshDiff < 15000) {
          logInfo("Rejecting manual refresh by a tap: too fast");
          return;
        }
      }
      prevManualRefresh = now;
      logInfo("Manual refresh by tap");    
      doCcErFeedback();      
      progressIndicators.drawAllProgress();
      cryptoIndicator.fetch(true);
  }
}

messaging.peerSocket.onopen = function() {
  applyState();
}

messaging.peerSocket.onclose = function() {
  applyState();
}

appbit.addEventListener("unload", function() {
  settings.saveSettings();
  stepsProgress.persist();
  cryptoIndicator.persist();
});


inbox.addEventListener("newfile", function() {
  let fileName;
  while (fileName = inbox.nextFile()) {
    let imagePath = `/private/data/${fileName}`;
    logInfo(`${imagePath} is now available`);
    background.setImage(imagePath);
    isBackgroundImageMode = true;
  }
});





