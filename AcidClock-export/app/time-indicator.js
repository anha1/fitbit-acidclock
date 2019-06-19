import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as weekday from "../common/weekday";
import { MODE } from "../common/mode";

export let TimeIndicator = function(document, settings) {
  let self = this;
  
  let timeEl = document.getElementById("time");
  let dateEl = document.getElementById("date"); 
  let amPmEl = document.getElementById("amPm");
  
  let getDateText = function(dateFormat, language, now) {   
    let day = now.getDate();
    let dayOfWeek = now.getDay();
    let monthIndex = now.getMonth() + 1; 
    
    switch (dateFormat) {     
      case "SW DD.MM": { 
        let dayName = weekday.getShortWeekdayName(language, dayOfWeek);
        return dayName + " " + util.zeroPad(day) + "." + util.zeroPad(monthIndex);  
      }
      case "SW MM.DD": {
        let dayName = weekday.getShortWeekdayName(language, dayOfWeek);
        return dayName + " " + util.zeroPad(monthIndex) + "." + util.zeroPad(day); 
      }
      case "SW DD SM": {
        let dayName = weekday.getShortWeekdayName(language, dayOfWeek);
        let monthName = weekday.getShortMonthName(language, monthIndex);
        return dayName + " " + util.zeroPad(day) + " " + monthName; 
      }
      case "SW DD LM": {
        let dayName = weekday.getShortWeekdayName(language, dayOfWeek);
        let monthName = weekday.getMonthName(language, monthIndex);
        return dayName + " " + util.zeroPad(day) + " " + monthName; 
      }  
      case "DD LM": {
        let monthName = weekday.getMonthName(language, monthIndex);
        return util.zeroPad(day) + " " + monthName; 
      }         
      case "MM.DD": {
        let dayName = weekday.getWeekdayName(language, dayOfWeek);
        return dayName + " " + util.zeroPad(monthIndex) + "." + util.zeroPad(day); 
      }
      case "DD.MM":
      default:  {
        let dayName = weekday.getWeekdayName(language, dayOfWeek);
        return dayName + " " + util.zeroPad(day) + "." + util.zeroPad(monthIndex);
      }
    }    
  }
  
  self.drawTime = function(now) {
    var hours = now.getHours();
   
    let isAmPm = preferences.clockDisplay === "12h" || settings.isTrue("isAmPm");
    
    if (isAmPm) {
      // 12h format      
      var amPm = "";   
      if (hours < 12) {
        amPm = "AM";
      } else {
        amPm = "PM";
      }
      amPmEl.text = amPm;
      amPmEl.style.display = "inline";
      hours = util.monoDigits(hours % 12 || 12);    
    } else {
      // 24h format
      amPmEl.style.display = "none";      
      hours = util.monoDigits(hours);
    }
    
    let mins = util.monoDigits(now.getMinutes());
    
    
    if (settings.isTrue("isShowSeconds")) {
      let seconds = util.monoDigits(now.getSeconds());
      timeEl.text = `${hours}:${mins}:${seconds}`;
    } else {
      timeEl.text = `${hours}:${mins}`;
    }
    
    let dateFormat = settings.getOrElse("dateFormat", "DD.MM");
    let language = settings.getOrElse("language", "en");
    let dateText = getDateText(dateFormat, language, now);
    
    dateEl.text = dateText;
  }
  
  self.setTimeColor = function(timeColor) {
    timeEl.style.fill = timeColor;
  }
        
  self.setDateColor = function(dateColor) {
    dateEl.style.fill = dateColor;
  }
}