import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as weekday from "../common/weekday";
import { MODE } from "../common/mode";

export let TimeIndicator = function(document, settings) {
  let self = this;
  
  let timeEl = document.getElementById("time");
  let dateEl = document.getElementById("date"); 

  self.drawTime = function(now) {
    var hours = now.getHours();
    var amPm = "";
    if (preferences.clockDisplay === "12h" || settings.isTrue("isAmPm")) {
      // 12h format    
      if (settings.isTrue("isAmPm")) {
        if (hours < 12) {
          amPm = " AM";
        } else {
          amPm = " PM";
        }
      }

      hours = hours % 12 || 12;    
    } else {
      // 24h format
      hours = util.zeroPad(hours);
    }
    let mins = util.zeroPad(now.getMinutes());

    timeEl.text = `${hours}:${mins}${amPm}`;

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