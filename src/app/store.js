import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../components/media-card/mediaReducer";
import textReducer from "../components/text-editor/textReducer";

const store = configureStore({
  reducer: {
    media: mediaReducer,
    text: textReducer,
  }
});

export default store;