// Redux store configuration
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import companyAuthSlice from './slices/companyAuthSlice';
import userAuthSlice from './slices/userAuthSlice';
import chatSlice from './slices/chatSlice';
import knowledgeBaseSlice from './slices/knowledgeBaseSlice';
import companySlice from './slices/companySlice';
import uiSlice from './slices/uiSlice';
import analyticsSlice from './slices/analyticsSlice';

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use proper storage based on environment
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['companyAuth', 'userAuth', 'company'], // Only persist auth and company data
  blacklist: ['ui'], // Don't persist UI state
};

const rootReducer = combineReducers({
  companyAuth: companyAuthSlice,
  userAuth: userAuthSlice,
  chat: chatSlice,
  knowledgeBase: knowledgeBaseSlice,
  company: companySlice,
  ui: uiSlice,
  analytics: analyticsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['_persist'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
