"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { userStore, userPersistor } from "@/store/user";

interface UserReduxProviderProps {
  children: React.ReactNode;
}

export const UserReduxProvider: React.FC<UserReduxProviderProps> = ({
  children,
}) => {
  return (
    <Provider store={userStore}>
      <PersistGate loading={null} persistor={userPersistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
