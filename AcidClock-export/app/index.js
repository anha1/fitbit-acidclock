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
import { locale } from "user-settings";
import { vibration } from "haptics";

clock.granularity = "minutes";

let root = document.getElementById('root');
let backgroundEl = document.getElementById('background')

const screenHeight = root.height //250 - Ionic, 300 - Versa
const screenWidth = root.width
let isLongScreen = screenHeight >= 300; //Versa and possible future devices

const SETTINGS_FILE = MODE.screenshotMode ? "settingsVS.cbor":"settingsV1.cbor";

let settings = new Settings(SETTINGS_FILE, function() {
  var defaults = {
      isShowStepsProgress: true,
      isFastProgress: false,
      language: 'en',
      dateFormat: "DD.MM",
      distanceUnit: "m",
      isShowDistanceUnit: false
    };
    if (units.distance === "us") {
      defaults.distanceUnit = "mi";
      defaults.dateFormat = "MM.DD"; 
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

let progressIndicators = new ProgressIndicators(document, settings, stepsProgress);

let hrmAnimation = new HrmAnimation(document);

let batteryIndicator = new BatteryIndicator(document);

let timeIndicator = new TimeIndicator(document, settings);

let cryptoIndicator = new CryptoIndicator(document, settings);

var isFastProgress = false;
var fastProgressInterval = null;
let initFastProgressInterval = function() {
  clearInterval(fastProgressInterval);
  fastProgressInterval = setInterval(progressIndicators.drawAllProgress, 5000);
}

let applyState = function() {
  if (display.on) {        
    hrmAnimation.start();
    if (isFastProgress) {      
      initFastProgressInterval()
    } else {
      clearInterval(fastProgressInterval);
    }
    hrmAnimation.hideIfNoReadings();
    progressIndicators.drawAllProgress();
    cryptoIndicator.refreshUi();
    cryptoIndicator.fetchIfStale();
  } else {
    hrmAnimation.stop(); 
    clearInterval(fastProgressInterval);
  }  
}

display.onchange = applyState;

clock.ontick = (evt) => {  
  let now = evt.date;
  timeIndicator.drawTime(now); 
  progressIndicators.drawAllProgress();
  batteryIndicator.draw();
  cryptoIndicator.refreshUi();
  cryptoIndicator.fetchIfStale();
}

let isCryptoMode = function() {
  return MODE.isForceCryptoMode || settings.isTrue("isShowCc"); 
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

    if (isLongScreen) {
      if (isCryptoMode()) {
        progressIndicators.toggleItem(3, true);
        progressIndicators.toggleItem(4, false);
        cryptoIndicator.initUpdates();
      } else {
        progressIndicators.toggleItem(3, true);
        progressIndicators.toggleItem(4, true);
        cryptoIndicator.clearUpdates();
      }
    } else {
      if (isCryptoMode()) {
        progressIndicators.toggleItem(3, false);
        progressIndicators.toggleItem(4, false);
        cryptoIndicator.initUpdates();
      } else {
        progressIndicators.toggleItem(3, true);
        progressIndicators.toggleItem(4, false);
        cryptoIndicator.clearUpdates();
      }
    }
    cryptoIndicator.refreshUi();
        
    settings.ifPresent("otherLabelsColor", function(otherLabelsColor) {
      root.style.fill = otherLabelsColor;
    });
        
    settings.ifPresent("backgroundColor", function(backgroundColor) {
      backgroundEl.style.fill = backgroundColor; 
      batteryIndicator.setColor(backgroundColor);
    });
    
    settings.ifPresent("heartColor", hrmAnimation.setColor);   
    
    settings.ifPresent("ccLogosColor", cryptoIndicator.setLogosColor);
        
    progressIndicators.applyGoalTypeSettings();
    progressIndicators.forceDrawAllProgress();
    applyState();
    logInfo("Settings applied");
  } catch (ex) {
    logError(ex);
  }
}

applySettings();

messaging.peerSocket.addEventListener("message", function(evt) {  
  if (!evt.data.hasOwnProperty("type")) {
    logInfo("Message without a type received: " + evt.data)
  }
  if (evt.data.type === "settings") {
    logInfo("Settings received");
    let newSettingsSource = {};  
    newSettingsSource[evt.data.key] = evt.data.value;
    settings.replaceSettings(newSettingsSource);
    applySettings();
    timeIndicator.drawTime(new Date());
  }
  if (evt.data.type === "CCER") {
    logInfo("Cryptocurrency exchange rate message has been received by the device");
    cryptoIndicator.onResponse(evt.data);
  }
})


let prevManualRefresh = null;
root.onclick = function(e) {  
  if (isCryptoMode() && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {      
      let now = (new Date()).getTime(); 
      if (prevManualRefresh) {
        let refreshDiff = now - prevManualRefresh;
        if (refreshDiff < 30000) {
          logInfo("Rejecting manual refresh by a tap: too fast");
          return;
        }
      }
      prevManualRefresh = now;
      logInfo("Manual refresh by tap");
      vibration.start("bump");
      //progressIndicators.drawAllProgress();
      cryptoIndicator.fetch(true);
  }
}


messaging.peerSocket.onopen = function() {

}

appbit.addEventListener("unload", function() {
  settings.saveSettings();
  stepsProgress.persist();
  cryptoIndicator.persist();
});


