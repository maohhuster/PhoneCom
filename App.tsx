import React from 'react';
import { AppProvider } from './context/AppContext';
import { MainContent } from './components/layout/MainContent';
import { ToastContainer } from './components/layout/ToastContainer';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
        <MainContent />
        <ToastContainer />
      </div>
    </AppProvider>
  );
};

export default App;