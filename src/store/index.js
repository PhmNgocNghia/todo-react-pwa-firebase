import { createStore, applyMiddleware, compose  } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer';

// config persist reducer
import {
  todoState
} from './todo/reducer';
import immutableTransform from 'redux-persist-transform-immutable'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage'

const persistConfig = {
  transforms: [immutableTransform({records: [todoState]})],
  key: 'root',
  storage,
  whitelist: 'todo'
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Config middleware
let middleware = applyMiddleware(
  thunk
)

// Not use middle in production
if (process.env.NODE_ENV !== 'production') {
  const devToolsExtension = window.devToolsExtension;

  // If devtool extension is loaded
  if (typeof devToolsExtension === 'function') {
    middleware = compose(middleware, devToolsExtension());
  }
}

export const store = createStore(persistedReducer, middleware)
export const persistor = persistStore(store)
