// Redux Provider wrapper
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const loadingComponent = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );

  return (
    <Provider store={store}>
      <PersistGate loading={loadingComponent} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
