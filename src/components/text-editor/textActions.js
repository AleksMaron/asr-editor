import { textUpdatedType, wordsJoinedType } from "./textReducer";

export function textUpdated(rawContentData) {
  return {
    type: textUpdatedType,
    payload: rawContentData
  }
}

export function wordsJoined(firstWordKey, secondWordKey) {
  return {
    type: wordsJoinedType,
    payload: {
      firstWordKey: firstWordKey,
      secondWordKey: secondWordKey
    }
  }
}
