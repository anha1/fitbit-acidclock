import * as fs from "fs";
import { logInfo, logError } from "../common/log";

const SETTINGS_TYPE = "cbor";

export let Settings = function(settingsFile, defaultsSource) {
  let self = this;
  
  let loadSettingsFromFs = function(settingsFile, defaultsSource) {
    try {
      return fs.readFileSync(settingsFile, SETTINGS_TYPE);
    } catch (ex) {
      logInfo("Can't load settings, loading defaults");    
      let rawDefaults = defaultsSource();
      let wrappedDefaults = {};
      for (var key in rawDefaults){
          let rawValue = rawDefaults[key]; 
          if (typeof rawValue === "boolean") {
            wrappedDefaults[key] = rawValue;
          } else {
            wrappedDefaults[key] = {values:[{value: rawValue}]};
          }
      }
      return wrappedDefaults;
    }
  }  
  
  self.settingsSource = loadSettingsFromFs(settingsFile, defaultsSource);
  
  let getRawValue = function(key) {
    if (self.settingsSource.hasOwnProperty(key)) {
      if (self.settingsSource[key].hasOwnProperty("values")) {
        return self.settingsSource[key].values[0].value;
      } else {
        return self.settingsSource[key];     
      }
    }
    return null;
  }
  
  self.isTrue = function(key) {
    return self.settingsSource.hasOwnProperty(key) && !!self.settingsSource[key];
  }
  
  self.isFalse = function(key) {
    return self.settingsSource.hasOwnProperty(key) && !self.settingsSource[key];
  }
  
  self.ifPresent = function(key, action) {
    let value = getRawValue(key);
    if (value) {
      action(value);
    }
  }
  
  self.isEquals = function(key, testValue) {   
    return getRawValue(key) === testValue;   
  }
  
  self.getOrElse = function(key, defaultValue) {
    let value = getRawValue(key);
    if (value) {
      return value;
    } else {
      return defaultValue;
    }
  }
  
  self.replaceSettings= function(newSettingsSource) {
    for (var key in newSettingsSource) {
      self.settingsSource[key] = newSettingsSource[key];
    }
  }
  
  self.saveSettings = function() {
    try {
      fs.writeFileSync(settingsFile, self.settingsSource, SETTINGS_TYPE);
    } catch (ex) { 
      console.log(ex);
    }
  }
}