import { configureStore } from "@reduxjs/toolkit";
import { throttle } from "lodash";

import mediaReducer from "../components/media-card/mediaReducer";
import textReducer from "../components/text-editor/textReducer";
import { loadState, saveState } from "./loadState";
import createSagaMiddleware from "@redux-saga/core";

import { watchTextUpdated } from "./saga";

const sagaMiddleware = createSagaMiddleware();

const persistedState = loadState();


const store = configureStore({
  reducer: {
    media: mediaReducer,
    text: textReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { ignoredPaths: ['text.rawContentData'] },
    serializableCheck: { ignoredPaths: ['text.rawContentData'] }
  }).concat(sagaMiddleware),

  preloadedState: persistedState
});

sagaMiddleware.run(watchTextUpdated);

store.subscribe(throttle(() => {
  saveState(store.getState());
}), 2000);

export default store;