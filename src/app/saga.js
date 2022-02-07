import { textUpdatedType, textUpdatedAsyncType } from "../components/text-editor/textReducer";
import {put, delay, takeLatest} from 'redux-saga/effects';

function* textChangedAsync(action) {
  yield delay(2000);
  yield put({type: textUpdatedAsyncType, payload: action.payload});
}


export function* watchTextUpdated() {
  yield takeLatest(textUpdatedType, textChangedAsync);
}