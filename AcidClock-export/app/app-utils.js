import * as util from "../common/utils";

export function getDistanceDisplayValue(settings, actual) {
    if (!actual) {
      return "0";
    }
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
    if (!settings.isFalse("isShowDistanceUnit")) {
      displayValue = displayValue + " " + distanceUnit;
    }
    return displayValue;
}

export function getSpeedDisplayValue(settings, actual) {
    if (!actual) {
      return "0";
    }
    var displayValue = actual * 1.0;
    let distanceUnit = settings.getOrElse("distanceUnit", "m");
  
    var defaultSpeedUnit = "s";
    if (distanceUnit === "km") {
      displayValue = (actual / 1000.);
      defaultSpeedUnit = "h";
    } else if (distanceUnit === "ft") {
      displayValue = actual * 3.2808;      
    } else if (distanceUnit === "mi") {
      displayValue = (actual / 1609.344);
      defaultSpeedUnit = "h";
    } else if (distanceUnit === "yd") {
      displayValue = actual * 1.0936;      
    } 
  
    let speedUnit = settings.getOrElse("speedUnit", defaultSpeedUnit);
  
    if (speedUnit == "pace") {      
      let paceMs = 1000.0 / displayValue; // ms / unit
      let paceFormatted = getDurationDisplayValue(paceMs)      
      displayValue = paceFormatted + "/" + distanceUnit;      
    } else if (speedUnit == "h") {
      displayValue = (3600.0 * displayValue).toFixed(2) + " " + distanceUnit +"/h";
    } else if (speedUnit == "m") {
      displayValue = (60.0 * displayValue).toFixed(2) + " " + distanceUnit +"/m";
    } else {
      displayValue = (displayValue).toFixed(1) + " " + distanceUnit +"/s";
    }
    
    return displayValue;
}

export function getDurationDisplayValue(actualMs) { 
    var hours = Math.floor(actualMs / 3600000) ;
    var minutes = Math.floor((actualMs % 3600000)  / 60000);
    var seconds = Math.floor((actualMs % 60000)/ 1000);
   
    return hours + ":" + util.monoDigits(minutes) + ":" + util.monoDigits(seconds);
}