// Redux Provider wrapper
'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import Loading from '@/components/ui/Loading';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
