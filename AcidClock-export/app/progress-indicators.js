import { goals } from "user-activity";
import { today } from "user-activity";
import { MODE } from "../common/mode";

const GOALS_COUNT = 5;

export let ProgressIndicators = function(document, settings, stepsProgress) {  
  let self = this;
  
  let getProgressEl = function(index) {  
    let containerEl = document.getElementById("goal" + index);
    return {
      index: index,
      prevProgressVal: null,
      container: containerEl,
      progress: containerEl.getElementsByClassName("progress")[0],
      count: containerEl.getElementsByClassName("count")[0],
      icon: containerEl.getElementsByClassName("icon")[0],
      tgtYes: containerEl.getElementsByClassName("tgt-yes")[0],
      tgtNo: containerEl.getElementsByClassName("tgt-no")[0]
    }
  }

  self.goalTypes = [
    "steps",
    "distance",
    "elevationGain",
    "calories",
    "activeMinutes"
  ];
  
  let goalTypesIcons = {
    "NONE": "stat_steps_solid_24px.png",
    "steps": "stat_steps_solid_24px.png",
    "distance": "stat_dist_solid_24px.png",
    "elevationGain": "stat_floors_solid_24px.png",
    "calories": "stat_cals_solid_24px.png",
    "activeMinutes": "stat_am_solid_24px.png"
  }
  
  let goalTypesColors = {
    "NONE": "gold",
    "steps": "gold",
    "distance": "yellowgreen",
    "elevationGain": "skyblue",
    "calories": "violet",
    "activeMinutes": "orange"
  }

  let progressEls = [];

  for (var i=0; i < GOALS_COUNT; i++) {
    progressEls.push(getProgressEl(i)); 
  }  
  
  let root = document.getElementById('root');
  
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
    let goalType = self.goalTypes[progressEl.index];

    let actual = today.local[goalType] || 0;
    if (progressEl.prevProgressVal == actual) {
      return;
    }  
    progressEl.prevProgressVal = actual;

    let goal = (goals[goalType] || 0);

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
    if (goalType === "distance" && actual) {    
      displayValue = getDistanceDisplayValue(actual);
    } else if (goalType === "steps" && actual) {    
      displayValue = getStepsDisplayValue(actual);
    }
    progressEl.count.text = displayValue;
  }
  
  self.drawAllProgress = function() {
    for (var i=0; i < GOALS_COUNT; i++) {  
      drawProgress(progressEls[i]);
    }
  }

  var resetProgressPrevState = function() {
    for (var i=0; i < GOALS_COUNT; i++) {  
      progressEls[i].prevProgressVal = null;
    }
  }
  
  self.forceDrawAllProgress = function() {
    resetProgressPrevState();
    self.drawAllProgress();
  }  
  
  self.applyGoalTypeSettings = function(newGoalTypes) {
     self.goalTypes = newGoalTypes;
     for (var i=0; i < GOALS_COUNT; i++) {
      let goalType = self.goalTypes[i];
      if (goalType === "NONE") {
        progressEls[i].container.style.display = "none";
      } else {  
        progressEls[i].container.style.display = "inline";
        var goalTypeProp = goalType + "Color";      
        progressEls[i].container.style.fill = settings.getOrElse(goalTypeProp, goalTypesColors[goalType] || "gold");
        progressEls[i].prevProgressVal = null;
        progressEls[i].icon.href = goalTypesIcons[goalType]; 
      }
    }
  }
}