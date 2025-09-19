// Redux Provider wrapper
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import IOSLoader from '@/components/ui/IOSLoader';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const loadingComponent = (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <IOSLoader size="xl" color="primary" className="mx-auto mb-4" />
      </div>
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
