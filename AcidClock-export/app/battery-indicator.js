import { battery } from "power";

export let BatteryIndicator = function(document) {  
  let self = this;
  
  let batContainerEl = document.getElementById("bat");
  let batEl = document.getElementById("bat-count");
  let batFillEl = document.getElementById("bat-fill");
  let batIcon = document.getElementById("bat-icon");
  let batFillWidth = 18;
  
  self.draw = function() {
    let level = battery.chargeLevel;
    batEl.text = Math.floor(level);
    batFillEl.width = Math.floor(batFillWidth * level / 100.);
  }
  
  self.setColor = function(color) {
    batFillEl.style.fill = color;
  }

}