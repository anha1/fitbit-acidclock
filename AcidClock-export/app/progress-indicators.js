import { goals } from "user-activity";
import { today } from "user-activity";
import { MODE } from "../common/mode";

export let ProgressIndicators = function(document, settings, stepsProgress) {  
  let self = this;
  
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

  let progressEls = [];

  for (var i=0; i < goalTypes.length; i++) {
    var goalType = goalTypes[i];
    progressEls.push(getProgressEl(goalType)); 
  }  
  
  let root = document.getElementById('root');

  self.toggleItem = function(index, isShow) {
    progressEls[index].container.style.display = isShow ? "inline" : "none";
  }
  
  let progressWidth = progressEls[0].container.getElementsByClassName("bg")[0].getBBox().width;
  
  let getDistanceDisplayValue = function(actual) {
      var displayValue = actual;
      let distanceUnit = settings.getOrElse("distanceUnit", "m");
      if (distanceUnit === "km") {
        displayValue = (actual / 1000.).toPrecision(3);
      } else if (distanceUnit === "ft") {
        displayValue = Math.round(actual * 3.2808);      
      } else if (distanceUnit === "mi") {
        displayValue = (actual / 1609.344).toPrecision(3);      
      } else if (distanceUnit === "yd") {
        displayValue = Math.round(actual * 1.0936);      
      }
      if (settings.isTrue("isShowDistanceUnit")) {
        displayValue = displayValue + " " + distanceUnit;
      }
      return displayValue;
  }

  let getStepsDisplayValue = function(actual) { 
    if (settings.isTrue("isShowStepsProgress")) {   
      let stepsProgressValue = stepsProgress.getStepsProgress(actual);    
      return actual + " ↑" + stepsProgressValue;    
    } else {
      return actual;
    }
  }

  let drawProgress = function(progressEl) {
    let prefix = progressEl.prefix;

    let actual = today.local[prefix] || 0;
    if (progressEl.prevProgressVal == actual) {
      return;
    }  
    progressEl.prevProgressVal = actual;

    let goal = (goals[prefix] || 0);

    var progress = 0;
    if (goal > 0) {
      progress = 100.* actual / goal;
    }

    if (MODE.isScreenshotMode) { 
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
  
  self.drawAllProgress = function() {
    for (var i=0; i < goalTypes.length; i++) {  
      drawProgress(progressEls[i]);
    }
  }

  var resetProgressPrevState = function() {
    for (var i=0; i < goalTypes.length; i++) {  
      progressEls[i].prevProgressVal = null;
    }
  }
  
  self.forceDrawAllProgress = function() {
    resetProgressPrevState();
    self.drawAllProgress();
  }  
  
  self.applyGoalTypeSettings = function() {
     for (var i=0; i < goalTypes.length; i++) {
      var goalTypeProp = goalTypes[i] + "Color";
      settings.ifPresent(goalTypeProp, function(goalTypeColor) {
        progressEls[i].container.style.fill = goalTypeColor;
      });
    }
  }
}