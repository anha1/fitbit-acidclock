import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { CryptoCompanion } from "./crypto.js"
import { me } from "companion"
import { logInfo, logError } from "../common/log";

const MILLISECONDS_PER_MINUTE = 1000 * 60;

let cryptoCompanion = new CryptoCompanion();

settingsStorage.addEventListener("change", evt => {
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
    cryptoCompanion.onSettingChange(evt.key);
  }
});

messaging.peerSocket.onopen = function() {  
  cryptoCompanion.tryPushFromCompanionIfRequeryAllowed();
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
      type: 'settings'
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    logInfo("Connection is not open");
  }
}

messaging.peerSocket.onmessage = function(evt) {  
  if (evt.data && evt.data.command == "CCER") {
    if (evt.data.isForce) {
      logInfo("Forced push requested");
      cryptoCompanion.push();
    } else {
      logInfo("Regular push requested");
      cryptoCompanion.tryPushFromCompanionIfRequeryAllowed();
    }    
  }
}

messaging.peerSocket.onerror = function(err) {
  logError("Connection error: " + err.code + " - " + err.message);
}