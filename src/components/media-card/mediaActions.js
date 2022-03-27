import { UPDATE_CURRENT_TIME, WORD_CLICKED, TOGGLE_PLAY } from "./mediaReducer";

export function updateCurrentTime(currentTime) {
  return {
    type: UPDATE_CURRENT_TIME,
    payload: currentTime
  }
}

export function wordClicked(wordClickedTime) {
  return {
    type: WORD_CLICKED,
    payload: wordClickedTime
  }
}

export function togglePlay() {
  return {
    type: TOGGLE_PLAY,
  }
}