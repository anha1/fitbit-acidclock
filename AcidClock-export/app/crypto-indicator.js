import exercise from "exercise";
import * as messaging from "messaging";
import { logInfo, logError } from "../common/log";
import * as fs from "fs";

const MILLISECONDS_PER_MINUTE = 1000 * 60;
const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "last_readings_crypto_data.cbor";

// workaround to avoid API query when switching from another application
let unpersistLastReadings = function() {
  try {
    let rs = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if (rs && rs.time && rs.data) {
      logInfo("CI: Old crypto data loaded"); 
      return rs;
    }
  } catch (ex) {
    // ignore, it is ok on first load
  }
  logInfo("CI: Can't load old crypto data");    
  return null;  
}

let persistLastReadings = function(data) {
  try {
    fs.writeFileSync(SETTINGS_FILE, data, SETTINGS_TYPE);
  } catch (ex) { 
    logError(ex);
  }
}

export let CryptoIndicator = function(document, settings, isLongScreen) {
  let self = this;  
  let leftLogo = document.getElementById("crypto-left-logo");
  let rightLogo = document.getElementById("crypto-right-logo");
  let leftEl = document.getElementById("crypto-left-er");
  let rightEl = document.getElementById("crypto-right-er");
  let containerEl = document.getElementById("crypto-container");
  
  var isEnabled = false;
  var lastReadings = unpersistLastReadings();
  
  var outdatedReadingsMinutes = 60;
  var fetchIfStaleLimitMs = 5000;
  
  let formatCcer = function (value) {
    var float = parseFloat(value);
    var disp = float.toFixed(1);
    if (float < 1) {
       disp = float.toFixed(4); 
    } else if (float >= 1000000) {
       // ready for The Moon :)
       disp = (float / 1000000.0).toFixed(2) + "M";   
    } else if (float >= 100000) {
       disp = (float / 1000.0).toFixed(2) + "K"; 
    } else if (float >= 10000) {
       disp = float.toFixed(0) ;      
    } else if (float < 1000) {
       disp = float.toFixed(2);
    }
    return disp;   
  }   
  
  let getLogo = function(cc) {
    return "crypto/" + cc + ".png";
  }
  
  let toggle = function(isShow) {
    containerEl.style.display = isShow ? "inline" : "none";
  }
    
  self.refreshUi = function() {  
    let isFroceHiddenOnIonic = !isLongScreen && exercise && exercise.state == "started";
    if (!isEnabled || isFroceHiddenOnIonic) {      
      toggle(false);
      return;
    }    
    let now = (new Date()).getTime(); 
    if (lastReadings && lastReadings.time) {
      let readingsDiff = now - lastReadings.time;
      if (readingsDiff > outdatedReadingsMinutes * MILLISECONDS_PER_MINUTE) {
        lastReadings = null;
        logInfo("CI: last readings are outdated, hiding the crypto area");
        toggle(false);
      } else {
        logInfo("CI: last readings are not outdated, showing the crypto area");
        toggle(true);
      }
    } else {
       logInfo("CI: No last readings, hiding the crypto area");
       toggle(false);       
    }
  }
    
  let drawData = function(data) {
    leftEl.text = formatCcer(data.leftCcer);
    rightEl.text = formatCcer(data.rightCcer);
    leftLogo.href = getLogo(data.leftCc);
    rightLogo.href = getLogo(data.rightCc);
    self.refreshUi();
  }
  
  if (lastReadings && lastReadings.data) {
    drawData(lastReadings.data);
  }
  
  self.onResponse = function(data) { 
    lastReadings = {
      data: data,
      time: (new Date()).getTime()
    };    
    drawData(lastReadings.data);
  }
  

  
  self.fetch = function(isForce) {
    if (isEnabled && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      logInfo("Making CC fetch request");            
      messaging.peerSocket.send({
        command: 'CCER',
        isForce: isForce
      });
    } else {
      logInfo("CI: can't request a refresh: socket closed");
    }
  }
  
  var lastFetchIfStale = null;
  
  self.fetchIfStale = function() {    
    if (isEnabled && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      if (lastReadings && lastReadings.time) {
        let now = (new Date()).getTime(); 
        if (lastFetchIfStale && (now - lastFetchIfStale < fetchIfStaleLimitMs)) {
          logInfo("fetchIfStale ignored");  
          return;
        }      
        lastFetchIfStale = now;
        
        let readingsDiff = now - lastReadings.time;
        let staleReadingsMintutes = parseInt(settings.getOrElse("autoRefreshIntervalCc", "15"));
        logInfo("staleReadingsMintutes: " + staleReadingsMintutes);
        if (readingsDiff > staleReadingsMintutes * MILLISECONDS_PER_MINUTE) {
          logInfo("CI: readings are stale, triggering a soft fetch");
          self.fetch(false);
        } else {
          logInfo("CI: readings are not stale: no soft fetch");
        }        
      } else {   
        logInfo("CI: readings are absent, triggering a soft fetch");
        setTimeout(function() {
          self.fetch(false);
        }, 1000); //workaround for a fresh install on simulator       
      }
    } 
  }
      
  self.initUpdates = function() { 
    isEnabled = true;
    self.refreshUi();
  }
  
  self.clearUpdates = function() {
    isEnabled = false;
    self.refreshUi();
  }
  
  self.setLogosColor = function(color) {
    leftLogo.style.fill = color; 
    rightLogo.style.fill = color;
  }
  
  self.persist = function() {
    if (lastReadings && lastReadings.time && lastReadings.data) {
      logInfo("CI: Persisting old crypto data"); 
      persistLastReadings(lastReadings);
    }
  }     
}