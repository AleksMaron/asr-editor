import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../components/media-card/mediaReducer";
import textReducer from "../components/text-editor/textReducer";
import { loadState, saveState } from "./loadState";

const persistedState = loadState();

const store = configureStore({
  reducer: {
    media: mediaReducer,
    text: textReducer,
  },
  preloadedState: persistedState
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;