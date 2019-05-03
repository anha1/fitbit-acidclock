import * as fs from "fs";
import { logInfo, logError } from "../common/log";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "steps-on-hour-start.cbor";

// workaround to avoid zero steps per current hour when switching from another application
let loadStepsOnHourStartData = function() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // ignore, it is ok on first load   
  }
}

let saveStepsOnHourStartData = function(data) {
  try {
    fs.writeFileSync(SETTINGS_FILE, data, SETTINGS_TYPE);
  } catch (ex) { 
    logError(ex);
  }
}

export let StepsProgress = function(redrawAction, currentStepsAction) {
  let self = this;
  
  var stepsProgressTimeout = null;
  
  var stepsOnHourStart = 0;
  
  const HOUR_IN_MS = 3600000;
      
  let getCurrentStepsOnHourStart = function() {
    let now = new Date();
    if (now.getHours() === 0) {
      // At 00:00:00-00:59:59 steps on hour start are 0
      return 0;
    }
    return currentStepsAction();
  }
    
  // this prevents steps progress reset after switching to another application
  let tryRecoverStepsOnHourStart = function() {
    try {
      let oldStepsOnHourStartData = loadStepsOnHourStartData();
      if (oldStepsOnHourStartData && oldStepsOnHourStartData.steps) {
        let nowDate = new Date();
        let oldDate = new Date(oldStepsOnHourStartData.time);
        if (nowDate.getHours() === oldDate.getHours() && (nowDate.getTime() - oldDate.getTime()) < HOUR_IN_MS) {      
          logInfo("steps on hour start recovered: " + oldStepsOnHourStartData.steps);
          return oldStepsOnHourStartData.steps;
        } else {
          logInfo("steps on hour start saved are stale, ignoring");
        }
      }       
    } catch (ex) {
      logError(ex);    
    }
    return getCurrentStepsOnHourStart();
  }  
     
  var updateStepsOnHourStartAndScheduleNextUpdate = function() {
    logInfo("StepsProgress tick");     
    clearTimeout(stepsProgressTimeout); 
    stepsOnHourStart = stepsProgressTimeout ? getCurrentStepsOnHourStart() : tryRecoverStepsOnHourStart();
    redrawAction();
    stepsProgressTimeout = setTimeout(updateStepsOnHourStartAndScheduleNextUpdate, getNextHourStartsInMs()); 
  }

  var getNextHourStartsInMs = function() {
    let now = new Date();
    return HOUR_IN_MS - now.getMinutes() * 60000 - now.getSeconds() * 1000 - now.getMilliseconds() + 1;
  }

  self.getStepsProgress = function(stepsCurrent) {
    return Math.max(0, stepsCurrent - stepsOnHourStart);
  }
  
  self.persist = function() {
    if (stepsOnHourStart) {
      saveStepsOnHourStartData({
        steps: stepsOnHourStart,
        time: (new Date()).getTime()
      });
    }
  } 
  
  self.initUpdates = function() { 
    if (!stepsProgressTimeout) {
      updateStepsOnHourStartAndScheduleNextUpdate();
    }
  }

  self.clearUpdates = function() {
    if (stepsProgressTimeout) {
      self.persist();
    }
    clearTimeout(stepsProgressTimeout);  
    stepsProgressTimeout = null;
  }
  
}