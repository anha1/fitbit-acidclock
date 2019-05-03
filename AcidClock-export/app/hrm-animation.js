import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

export let HrmAnimation = function(document, settings) {
  let self = this;  
  let hrEl = document.getElementById("hr");
  let hrIconSystoleEl = document.getElementById("hr-icon-systole");
  let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");
  let hrCountEl = document.getElementById("hr-count");  
  let hrRestingEl = document.getElementById("restingHr");  
  let hrRestingCountEl = document.getElementById("hr-resting-count");  
    
  let hrm = new HeartRateSensor();

  var hrmAnimationPhase = false;

  var prevHrmRate = null;

  var hrmRate = null;

  var hrAnimatedInterval = null;
  
  let hideHr = function() {
     hrmRate = null;
     prevHrmRate = null;   
     stopHrAnimation();
     hrEl.style.display = "none";
  }

  let tryShowRestingBpm = function() {
    if (user && settings.isTrue("isShowRestingBpm")) {
        let restingBpm = user.restingHeartRate;
        if (restingBpm) {
          hrRestingCountEl.text = restingBpm;  
          hrRestingCountEl.style.display = "inline"; 
        }
    } else {
      hrRestingCountEl.style.display = "none"; 
    }        
  }
        
  let showHr = function() {  
    // updating HRM readings
    hrmRate = hrm.heartRate;
    if (hrmRate) {
      // displaying HRM readings
      hrCountEl.text = hrmRate;  
      if (!prevHrmRate) {
        //this is the first showHr() call after hideHr() - showing the element and starting the animation
        hrEl.style.display = "inline";    
        animateHr();
      }
      tryShowRestingBpm();
    } else {
      hideHr();
    }
  }

  let initHrInterval = function() {
    clearInterval(hrAnimatedInterval);
    hrAnimatedInterval = setInterval(animateHr, 30000/hrmRate);
  }

  let stopHrAnimation = function() {
    clearInterval(hrAnimatedInterval);
    hrIconDiastoleEl.style.display = "inline";
  }

  let animateHr = function() {   
      //animating a single systole or diastole depending on the animation phase
      if (hrmAnimationPhase) {
        hrIconDiastoleEl.style.display = "none";
      } else {
        hrIconDiastoleEl.style.display = "inline";  
      }  
      hrmAnimationPhase =!hrmAnimationPhase;

      if (prevHrmRate != hrmRate) {
        //HRM readings have been changed: need to ajust and restart animation interval
        clearInterval(hrAnimatedInterval);      
        prevHrmRate = hrmRate;
        initHrInterval();      
      }     
      prevHrmRate = hrmRate;
  }

  hrm.onreading = showHr;
  
  self.setColor = function(color) {
    hrIconDiastoleEl.style.fill = color;
    hrIconSystoleEl.style.fill = color;  
  }
  
  self.start = function() {
    hrm.start();
  }
  
  self.stop = function() {
    hrm.stop();
    hideHr();   
  }    
  
  self.hideIfNoReadings = function() {
    if (!hrmRate) {
      hideHr()    
    }
  }
  
  self.onSettingsChange = function() {
    tryShowRestingBpm();
  }
}