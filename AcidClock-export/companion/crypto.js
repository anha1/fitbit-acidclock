import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { logInfo, logError } from "../common/log";
import { MODE } from "../common/mode";
import { me as device } from "device";
import { me as companion} from "companion"

const MILLISECONDS_PER_MINUTE = 1000 * 60;

let ccKrakenMapping = {
  "btc": {key: "XXBTZUSD", query: "XBTUSD"},
  "eth": {key: "XETHZUSD", query: "ETHUSD"},
  "ltc": {key: "XLTCZUSD", query: "LTCUSD"},
  "xrp": {key: "XXRPZUSD", query: "XRPUSD"},
  "xlm": {key: "XXLMZUSD", query: "XLMUSD"}
}

let ccToQuery = function(cc) {
  return ccKrakenMapping[cc].query;
}

let ccToKey = function(cc) {
  return ccKrakenMapping[cc].key;
}

let getOrElse = function(key, defaultValue) {
  let string = settingsStorage.getItem(key); 
  if (string) {
    return JSON.parse(string)["values"][0].value;
  }
  return defaultValue;
}

let returnCcer = function(ccer) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(ccer);
    logInfo("CC: response pushed to a device");
  } else {
    logInfo("CC: can't push response to a device: socket closed");
  }
}

let queryCcer = function(leftCc, rightCc, ratio) {
    
  let url = "https://api.kraken.com/0/public/Ticker?pair=" + ccToQuery(leftCc) + "," + ccToQuery(rightCc);
  logInfo(url);
  fetch(url)
  .then(function (response) {
      response.json()
      .then(function(data) {
        var ccer = {
          leftCcer: ratio * data["result"][ccToKey(leftCc)]["c"][0],
          rightCcer:  ratio * data["result"][ccToKey(rightCc)]["c"][0],
          leftCc: leftCc,
          rightCc: rightCc,
          type: "CCER"
        }
        returnCcer(ccer);
      });
  })
  .catch(function (err) {
    logInfo("Error fetching CCER: " + err);
  });
}

export let CryptoCompanion = function() {
  var self = this;
  
  self.isEnabled = function() {
    return MODE.isForceCryptoMode || "true" === settingsStorage.getItem("isShowCc");
  }
  
  self.push = function() {
    let leftCc = getOrElse("leftCc", "btc");
    let rightCc = getOrElse("rightCc", "eth");  
    let referenceCurrencyCc = getOrElse("referenceCurrencyCc", "USD");
    if ("USD" == referenceCurrencyCc) {
      queryCcer(leftCc, rightCc, 1);   
    } else {
      let url = "https://api.exchangeratesapi.io/latest?base=USD";
       fetch(url)
       .then(function (response) {
          response.json()
          .then(function(data) {
            var ratio = data["rates"][referenceCurrencyCc];
            queryCcer(leftCc, rightCc, ratio); 
          })
       })                
    }
  }
  
  self.tryPushIfAllowed = function() {
    if (!(self.isEnabled() && (messaging.peerSocket.readyState === messaging.peerSocket.OPEN))) {
      return;
    }
    
    logInfo("CC: requesting a fetch");
    self.push();

  }
  
  let toggleWakeUp = function() {
     if (self.isEnabled()) {
       logInfo("CC: wake up enabled");       
       companion.wakeInterval = 30 * MILLISECONDS_PER_MINUTE;
     } else {
       logInfo("CC: wake up disabled");
       companion.wakeInterval = undefined;
     }
  }
  
  toggleWakeUp();
  
  self.onSettingChange = function(key) {
    if (!key) {
      return;
    }
    if ("leftCc" === key || "rightCc" === key || "referenceCurrencyCc" === key) {
      logInfo("CC: currency changed"); 
      self.tryPushIfAllowed();
    }    
    
    if ("isShowCc" === key) {
      toggleWakeUp();
      self.tryPushIfAllowed();
    } 
  }
}