import { updateCurrentTimeType } from "./mediaReducer";

export function updateCurrentTime(currentTime) {
  return {
    type: updateCurrentTimeType,
    payload: currentTime
  }
}