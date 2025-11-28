import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import ChatPage from '@/pages/ChatPage/ChatPage';

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/:slug" element={<ChatPage />} />
            <Route path="/:slug/chat" element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};
