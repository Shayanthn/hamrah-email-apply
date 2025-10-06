import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import WelcomeModal from './components/Onboarding/WelcomeModal';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Professors = lazy(() => import('./pages/Professors'));
const Emails = lazy(() => import('./pages/Emails'));
const Applications = lazy(() => import('./pages/Applications'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Settings = lazy(() => import('./pages/Settings'));
const Guide = lazy(() => import('./pages/Guide'));
const Premium = lazy(() => import('./pages/Premium'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="mr-3 text-gray-600 dark:text-gray-300 font-persian">در حال بارگذاری...</span>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <DatabaseProvider>
            <Router>
              <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                  
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/professors" element={<Professors />} />
                        <Route path="/emails" element={<Emails />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/guide" element={<Guide />} />
                        <Route path="/premium" element={<Premium />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
                
                <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
              </div>
            </Router>
          </DatabaseProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;