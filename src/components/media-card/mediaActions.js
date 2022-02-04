import { updateCurrentTimeType, wordClickedType } from "./mediaReducer";

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