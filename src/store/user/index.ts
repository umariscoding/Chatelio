// User-specific Redux store configuration
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import userAuthSlice from './slices/userAuthSlice';
import chatSlice from './slices/chatSlice';

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
  key: 'user',
  storage,
  whitelist: ['userAuth'], // Only persist auth data
  blacklist: ['chat'], // Don't persist chat (loaded from API)
};

const rootReducer = combineReducers({
  userAuth: userAuthSlice,
  chat: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const userStore = configureStore({
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

export const userPersistor = persistStore(userStore);

export type UserRootState = ReturnType<typeof userStore.getState>;
export type UserAppDispatch = typeof userStore.dispatch;

