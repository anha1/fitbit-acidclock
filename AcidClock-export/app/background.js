import * as fs from "fs";
import { logInfo, logError } from "../common/log";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "backgroundImagePath.cbor";

let unpersistImagePath = function() {
  try {
    let rs = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    if (rs) {
      logInfo("CI: Old background image path loaded"); 
      return rs;    
    } 
  } catch (ex) {
    // ignore, it is ok on first load
  }
  logInfo("CI: Can't load background image path");    
  return null;  
}

let persistImagePath = function(data) {
  try {
    fs.writeFileSync(SETTINGS_FILE, data, SETTINGS_TYPE);
  } catch (ex) { 
    logError(ex);
  }
}

export let Background = function(document, settings) {
  let self = this;  
  let backgroundEl = document.getElementById('background');
  let backgroundImageEl = document.getElementById('backgroundImage');
    
  self.setColor = function(color) {
    backgroundEl.style.display = "inline";
    backgroundImageEl.style.display = "none";
    backgroundEl.style.fill = color;
    persistImagePath("");
  }

  self.setImage = function(imagePath) {
    backgroundEl.style.display = "none";
    backgroundImageEl.style.display = "inline";
    backgroundImageEl.href = imagePath;
    persistImagePath(imagePath);
  }  
  
  self.tryRecoverImage = function(backgroundColor) {
    let oldPath = unpersistImagePath();
    if (oldPath) {
      self.setImage(oldPath);
      return true;
    } else {
      self.setColor(backgroundColor);
      return false;
    }
  }
}