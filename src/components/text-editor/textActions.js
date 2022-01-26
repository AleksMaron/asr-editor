import { textUpdatedType } from "./textReducer";

export function textUpdated(rowContentData) {
  return {
    type: textUpdatedType,
    payload: rowContentData
  }
}