import { updateCurrentTimeType, wordClickedType, playOrPauseType } from "./mediaReducer";

export function updateCurrentTime(currentTime) {
  return {
    type: updateCurrentTimeType,
    payload: currentTime
  }
}

export function wordClicked(wordClickedTime) {
  return {
    type: wordClickedType,
    payload: wordClickedTime
  }
}

export function playOrPause() {
  return {
    type: playOrPauseType,
  }
}