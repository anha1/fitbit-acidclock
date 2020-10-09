import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { logInfo, logError } from "../common/log";
import { MODE } from "../common/mode";
import { me as device } from "device";
import { me as companion} from "companion"

const MILLISECONDS_PER_MINUTE = 1000 * 60;

let getListItemOrElse = function(key, defaultValue) {
  let string = settingsStorage.getItem(key); 
  if (string) {
    return JSON.parse(string)["values"][0].value;
  }
  return defaultValue;
}

let getOrElse = function(key, defaultValue) {
  let structure = settingsStorage.getItem(key); 
  if (structure) {    
    let value = JSON.parse(structure)['name'];
    if (value) {
      return value;
    }
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

let jsonPriceToVal = function(response, ratio) {
  if (response['price']) {
    let price = parseFloat(response['price']);
    if (ratio != 1 && response['symbol'] && response['symbol'].indexOf("USD") > 1) { // convert BTCUSDT but not BTCEUR or USDTBTC  
      return price * ratio;
    } 
    return price;
  } else {
    return 0;
  }
}

let queryCcer = function(leftCc, rightCc, ratio) {
  let url = "https://api.binance.com/api/v1/ticker/price?symbol=";
  Promise.all([fetch(url + leftCc),  fetch(url + rightCc)])
  .then(function(responses) {
       Promise.all([responses[0].json(), responses[1].json()])
       .then(function(jsonPrices) {
          let leftVal = jsonPriceToVal(jsonPrices[0], ratio);
          let rightVal = jsonPriceToVal(jsonPrices[1], ratio);
          var ccer = {
            leftCcer: leftVal,
            rightCcer: rightVal,
            leftCc: leftCc,
            rightCc: rightCc,
            type: "CCER"
          }
          returnCcer(ccer);         
       })
  }).catch(function (err) {
    logInfo("Error fetching CCER: " + err);
  });
}

export let CryptoCompanion = function() {
  var self = this;
  
  self.isEnabled = function() {
    return MODE.isForceCryptoMode || "true" === settingsStorage.getItem("isShowCc");
  }
  
  self.push = function() {
    let leftCc = getOrElse("leftCcTicker", "BTCUSDT");
    let rightCc = getOrElse("rightCcTicker", "ETHUSDT");  
    let referenceCurrencyCc = getListItemOrElse("referenceCurrencyCc", "USD");
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