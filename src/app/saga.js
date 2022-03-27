import { TEXT_UPDATED, TEXT_UPDATED_ASYNC } from "../components/text-editor/textReducer";
import {put, takeLatest} from 'redux-saga/effects';
import { saveState } from "./loadState";
import store from "./store";

function* textChangedAsync(action) {
  yield put({type: TEXT_UPDATED_ASYNC, payload: action.payload});
  yield saveState(store.getState());
}


export function* watchTextUpdated() {
  yield takeLatest(TEXT_UPDATED, textChangedAsync);
}