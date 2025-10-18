"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { companyStore, companyPersistor } from "@/store/company";

interface CompanyReduxProviderProps {
  children: React.ReactNode;
}

export const CompanyReduxProvider: React.FC<CompanyReduxProviderProps> = ({
  children,
}) => {
  return (
    <Provider store={companyStore}>
      <PersistGate loading={null} persistor={companyPersistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
