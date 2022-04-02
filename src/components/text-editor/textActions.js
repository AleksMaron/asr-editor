import { TEXT_UPDATED, FILE_UPLOADED, TOGGLE_SAVE } from './textReducer';

export function textUpdated(rawContentData) {
  return {
    type: TEXT_UPDATED,
    payload: rawContentData
  }
}

export function uploadTextFromFile(text) {
  return {
    type: FILE_UPLOADED,
    payload: text
  }
}

export function toggleSave() {
  return {
    type: TOGGLE_SAVE
  }
}

