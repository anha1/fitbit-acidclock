import { MODE } from "../common/mode";

export let logInfo = function(msg) {
  if (MODE.isVerboseLogging) {
    console.log(msg);
  }
}

export let logError = function(msg) {
  console.log(msg);
}