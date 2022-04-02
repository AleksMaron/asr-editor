import { TEXT_UPDATED, TEXT_UPDATED_ASYNC, TOGGLE_SAVE } from '../components/text-editor/textReducer';
import {put, takeLatest} from 'redux-saga/effects';
import { saveState } from './loadState';
import store from './store';

function* textChangedAsync(action) {
  yield put({type: TEXT_UPDATED_ASYNC, payload: action.payload});
  yield put({type: TOGGLE_SAVE});
  yield saveState(store.getState());
}


export function* watchTextUpdated() {
  yield takeLatest(TEXT_UPDATED, textChangedAsync);
}