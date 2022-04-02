import { configureStore } from '@reduxjs/toolkit';

import mediaReducer from '../components/media-card/mediaReducer';
import textReducer from '../components/text-editor/textReducer';
import { loadState } from './loadState';
import createSagaMiddleware from '@redux-saga/core';

import { watchTextUpdated } from './saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    media: mediaReducer,
    text: textReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { ignoredPaths: ['text.rawContentData'] },
    serializableCheck: { ignoredPaths: ['text.rawContentData'] }
  }).concat(sagaMiddleware),

  preloadedState: loadState()
});

sagaMiddleware.run(watchTextUpdated);

export default store;