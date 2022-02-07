import { textUpdatedType } from "./textReducer";

export function textUpdated(rawContentData) {
  return {
    type: textUpdatedType,
    payload: rawContentData
  }
}