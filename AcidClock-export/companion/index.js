import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { CryptoCompanion } from "./crypto.js"
import { me } from "companion"
import { logInfo, logError } from "../common/log";
import { device } from "peer";
import { settingsStorage } from "settings";
import { outbox } from "file-transfer";
import { Image } from "image";

const MILLISECONDS_PER_MINUTE = 1000 * 60;

let cryptoCompanion = new CryptoCompanion();

settingsStorage.setItem("modelName", device.modelName); //"Ionic" "Versa" "Versa Lite"
settingsStorage.setItem("screenWidth", device.screen.width);
settingsStorage.setItem("screenHeight", device.screen.height);

function setDefaultTrue(key) {
  let extantValue = settingsStorage.getItem(key);
  if (extantValue === null) {
    settingsStorage.setItem(key, "true");
  }
}

setDefaultTrue("isExercise");
setDefaultTrue("isGps");
setDefaultTrue("isBluetoothIndicator");
setDefaultTrue("isAmPm");
setDefaultTrue("isShowStepsProgress");

var compressAndTransferImage = function(settingsValue) {
  const imageData = JSON.parse(settingsValue);
  Image.from(imageData.imageUri)
    .then(image =>
      image.export("image/jpeg", {
        background: "#000000",
        quality: 97
      })
    )
    .then(buffer => outbox.enqueue(`${Date.now()}.jpg`, buffer))
    .then(fileTransfer => {
      logInfo(`Enqueued ${fileTransfer.name}`);
    });
}

settingsStorage.addEventListener("change", evt => {
  if (evt.key === "backgroundImage") {
    compressAndTransferImage(evt.newValue);
  } else if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
    cryptoCompanion.onSettingChange(evt.key);
  }
});

messaging.peerSocket.onopen = function() {  
  cryptoCompanion.tryPushIfAllowed();
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
      cryptoCompanion.tryPushIfAllowed();
    }    
  }
}

messaging.peerSocket.onerror = function(err) {
  logError("Connection error: " + err.code + " - " + err.message);
}

if (me.launchReasons.wokenUp) {
  logInfo("Started due to wake interval!");
  cryptoCompanion.tryPushIfAllowed();
}