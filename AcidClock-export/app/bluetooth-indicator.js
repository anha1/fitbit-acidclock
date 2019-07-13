import * as messaging from "messaging";

export let BluetoothIndicator = function(document, settings, isForceNoBluetoothIndicator) {
  let self = this;  
  let enabledEl = document.getElementById("bluetooth-icon-enabled");
  let disabledEl = document.getElementById("bluetooth-icon-disabled");
    
  self.isEnabled = function() {
    return !(settings.isFalse("isBluetoothIndicator") || isForceNoBluetoothIndicator());
  }
  
  self.draw = function() {
    if (self.isEnabled()) {
      let isConnected = messaging.peerSocket.readyState === messaging.peerSocket.OPEN;
      enabledEl.style.display = isConnected ? "inline" : "none";
      disabledEl.style.display = isConnected ? "none" : "inline";    
    } else {
      enabledEl.style.display = "none";
      disabledEl.style.display = "none";   
    }   
  }
}