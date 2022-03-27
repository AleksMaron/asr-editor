import { TEXT_UPDATED } from "./textReducer";

export function textUpdated(rawContentData) {
  return {
    type: TEXT_UPDATED,
    payload: rawContentData
  }
}


