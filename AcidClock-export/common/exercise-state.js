import exercise from "exercise";
import { me as appbit } from "appbit";

export let isActiveExerciseMode = function(settings) {
    if (!appbit.permissions.granted("access_exercise") || settings.isFalse("isExercise")) {
      return false;
    }  
    return !!exercise;
}


export let isActiveExercise = function(settings) {
    if (!isActiveExerciseMode(settings)) {
      return false;
    }  
    return exercise && exercise.state != "stopped";
}

export let dropActiveExecrciseIfFeatureDisabled = function(settings) {
    if (!appbit.permissions.granted("access_exercise")) { 
      return false;
    }  
    if (settings.isFalse("isExercise") && exercise && exercise.state != "stopped") {   
        exercise.stop();
        return true;    
    }               
    return false;
}