import { configureStore } from "@reduxjs/toolkit";

import mediaReducer from "../components/media-card/mediaReducer";

const store = configureStore({
  reducer: {
    media: mediaReducer,
  }
});

export default store;