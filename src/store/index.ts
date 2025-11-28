import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userAuthReducer from "./slices/userAuthSlice";
import chatReducer from "./slices/chatSlice";

const persistConfig = {
  key: "chatelio-user",
  storage,
  whitelist: ["userAuth"],
  blacklist: ["chat"],
};

const rootReducer = combineReducers({
  userAuth: userAuthReducer,
  chat: chatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
