import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as weekday from "../common/weekday";
import { MODE } from "../common/mode";

export let TimeIndicator = function(document, settings) {
  let self = this;
  
  let timeEl = document.getElementById("time");
  let dateEl = document.getElementById("date"); 
  let amPmEl = document.getElementById("amPm");
  
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
    
    let day = now.getDate();
    let monthIndex = now.getMonth() + 1;

    let dayName = weekday.getWeekdayName(settings.getOrElse("language", "en"), now.getDay());

    var dateText;  

    if (settings.isEquals("dateFormat", "DD.MM")) {
      dateText= ", " + util.zeroPad(day) + "." + util.zeroPad(monthIndex);    
    } else {
      dateText= ", " + util.zeroPad(monthIndex) + "." + util.zeroPad(day);
    }
    dateEl.text =  dayName +  dateText;
  }
  
  self.setTimeColor = function(timeColor) {
    timeEl.style.fill = timeColor;
  }
        
  self.setDateColor = function(dateColor) {
    dateEl.style.fill = dateColor;
  }
}