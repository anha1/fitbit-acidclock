import exercise from "exercise";
import { vibration } from "haptics";
import { logInfo, logError } from "../common/log";
import * as util from "../common/utils";
import * as appUtils from "./app-utils";
import { MODE } from "../common/mode";
import { display } from "display";
import { me as device } from "device";

export let ExerciseIndicator = function(document, settings, additionalActionsOnStateChange) {
  let self = this;
  
  let viewRegular = document.getElementById("view-regular");
  let viewExercise = document.getElementById("view-exercise");
  let viewExerciseType = document.getElementById("view-exercise-type");

  let btnPause = document.getElementById("btn-pause-exercise");
  let btnFinish = document.getElementById("btn-finish-exercise");
  let btnPlay = document.getElementById("btn-start-exercise");
  let btnBack = document.getElementById("btn-back-exercise");
  
  let metricTime = document.getElementById("exercise-metric-time-count");
  let metricCals = document.getElementById("exercise-metric-cals-count");
  let metricDist = document.getElementById("exercise-metric-dist-count");
  let metricSpeed = document.getElementById("exercise-metric-speed-count");
  
  let metricTimeContainer = document.getElementById("exercise-metric-time");
  let metricCalsContainer = document.getElementById("exercise-metric-cals");
  let metricDistContainer = document.getElementById("exercise-metric-dist");
  let metricSpeedContainer = document.getElementById("exercise-metric-speed");
  
  let exerciseType1 =  document.getElementById("exercise-type-1");
  let exerciseType2 =  document.getElementById("exercise-type-2");
  let exerciseType3 =  document.getElementById("exercise-type-3");
  let exerciseType4 =  document.getElementById("exercise-type-4");
    
  let locationActivities = ["run", "hiking", "walk", "cycling", "golf"]
  
  let goalTypesColors = {
    "NONE": "gold",
    "steps": "gold",
    "distance": "yellowgreen",
    "elevationGain": "skyblue",
    "calories": "violet",
    "activeMinutes": "orange"
  }
    
  let typeToCaption = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    if (s === "circuit-training") {
      return "Circuit";
    }
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  

  self.draw = function() {
    if (!exercise || !exercise.stats) {
      return;
    }    
    
    if (MODE.isScreenshotMode) {
      metricTime.text = "0:45:55";
      metricCals.text = "302";    
      metricDist.text = "7.66 km"; 
      metricSpeed.text = "10.04 km/h";      
      return;
    }
    
    metricTime.text = appUtils.getDurationDisplayValue(exercise.stats.activeTime);
    metricCals.text = exercise.stats.calories;    
    metricDist.text = appUtils.getDistanceDisplayValue(settings, exercise.stats.distance);
    if (exercise.stats.speed) {
      let speedType = settings.getOrElse("speedType", "average");
      metricSpeed.text = appUtils.getSpeedDisplayValue(settings, exercise.stats.speed[speedType]);
    }
  }
  
  var refreshInterval = null;
  var isMenuMode = false;
  
  self.stopRefresh = function() {
    clearInterval(refreshInterval);
     refreshInterval = null;
  }
  
  self.startRefresh = function() {
    if (display.on) {
      self.draw();
      clearInterval(refreshInterval);      
      refreshInterval = setInterval(self.draw, 1000);
    } else {
      self.stopRefresh();
    }
  }
  
  self.applyState = function() {   
    if (!exercise || settings.isFalse("isExercise")) {
      btnFinish .style.display = "none";
      viewExerciseType.style.display = "none";
      viewRegular.style.display = "inline";
      viewExercise.style.display = "none";
      btnPlay.style.display = "none";
      btnPause.style.display = "none";
      self.stopRefresh();
      if (exercise && exercise.state != "stopped") {
        exercise.stop();
      }       
      return;
    }
    
    if (isMenuMode) {
      exerciseType1.text = typeToCaption(getExerciseType(1));
      exerciseType2.text = typeToCaption(getExerciseType(2));
      exerciseType3.text = typeToCaption(getExerciseType(3));
      exerciseType4.text = typeToCaption(getExerciseType(4));    
      exerciseType4.style.display = (device.modelName == "Ionic") ? "none" :"inline";  
    }
    
    let isGps = MODE.isScreenshotMode || (exercise.type && locationActivities.indexOf(exercise.type) > -1);
    
    viewExerciseType.style.display = isMenuMode ? "inline" :"none";  
    metricDistContainer.style.display = isGps ? "inline" :"none";  
    metricSpeedContainer.style.display = isGps ? "inline" :"none";  
    
    if (exercise.state == "started") {
      btnFinish .style.display = "inline";
      viewRegular.style.display = "none";
      viewExercise.style.display = "inline";
      btnPlay.style.display = "none";
      btnPause.style.display = "inline";      
      self.startRefresh();
    } else if (exercise.state == "paused") {
      btnFinish .style.display = "inline";
      viewRegular.style.display = "inline";
      viewExercise.style.display = "none";
      btnPlay.style.display = "inline";
      btnPause.style.display = "none";
      self.stopRefresh();
    } else {
      btnFinish .style.display = "none";
      viewRegular.style.display = "inline";
      viewExercise.style.display =  "none";
      btnPlay.style.display = "inline";
      btnPause.style.display = "none";
      self.stopRefresh();
    } 
    additionalActionsOnStateChange();
  }
  
  let defaultExerciseTypes = ["run", "cycling", "workout", "treadmill"];
  
  let getExerciseType = function(n) {    
    return settings.getOrElse("exerciseType" + n, defaultExerciseTypes[n - 1]);
  }
  
  var hideMenuTimeout = null;
  
  let drawMenu = function() {
    clearTimeout(hideMenuTimeout);
    isMenuMode = true;      
    self.applyState();
    hideMenuTimeout = setTimeout(function() {
      isMenuMode = false;
      self.applyState();
    }, 15000)
  }   
  
  let hideMenu = function() {
    clearTimeout(hideMenuTimeout);
    isMenuMode = false;
  }
  
  if (exercise) {
    exercise.onstatechange = function() {
      self.applyState();
    }
  }
  
  self.setColor = function(color) {
    btnPause.style.fill = color;
    btnFinish.style.fill = color;
    btnPlay.style.fill = color;
    btnBack.style.fill = color;
  }
                                             
  self.applyState();
  
  self.applyGoalTypeSettings = function(newGoalTypes) {
    metricTimeContainer.style.fill = settings.getOrElse("activeMinutesColor", "orange");
    metricCalsContainer.style.fill = settings.getOrElse("caloriesColor", "violet");
    metricDistContainer.style.fill = settings.getOrElse("distanceColor", "yellowgreen");
    metricSpeedContainer.style.fill = settings.getOrElse("distanceColor", "yellowgreen");
  }

  btnFinish.onclick = function(evt) {
    if (!exercise) {
      return;
    }
    if (exercise.state != "stopped") {
      exercise.stop();
      vibration.start("confirmation");
    }    
    self.applyState();    
  }
  
  btnPause.onclick = function(evt) {
    if (!exercise) {
      return;
    }
    if (exercise.state == "started") {
      exercise.pause();
      vibration.start("confirmation");
    }    
    self.applyState();   
  }

  btnPlay.onclick = function(evt) {
    if (!exercise) {
      return;
    }
    if (exercise.state == "stopped") {
      drawMenu();    
    } else if (exercise.state == "paused") {
      exercise.resume();
      vibration.start("confirmation");
      self.applyState();      
    }   
  }
  
  btnBack.onclick = function(evt) {
    isMenuMode = false;
    self.applyState();  
  }
  
  let startExercise = function(exerciseType) {
    if (!exercise) {
      return;
    }
    if (exercise.state != "stopped") {
      self.applyState(); 
      return;
    }
    
    vibration.start("confirmation");
    
    let isGps = !settings.isFalse("isGps") && !MODE.isScreenshotMode && locationActivities.indexOf(exerciseType) > -1;
    
    exercise.start(exerciseType, { gps: isGps }); 
    hideMenu();  
    self.applyState(); 
  }
  
  let getEexerciseTypeBtnCallback = function(n) {
    return function(evt) {
      startExercise(getExerciseType(n));
    }
  }
  
  exerciseType1.onclick = getEexerciseTypeBtnCallback(1);  
  exerciseType2.onclick = getEexerciseTypeBtnCallback(2);  
  exerciseType3.onclick = getEexerciseTypeBtnCallback(3);  
  exerciseType4.onclick = getEexerciseTypeBtnCallback(4);

}