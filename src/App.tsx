import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider } from './context/AppStateContext';
import Navbar from './components/layout/Navbar';
import TabBar from './components/layout/TabBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TrailsPage from './pages/TrailsPage';
import PetsPage from './pages/PetsPage';
import PetProfilePage from './pages/PetProfilePage';
import RecordHikePage from './pages/RecordHikePage';
import HistoryPage from './pages/HistoryPage';
import AnalysisPage from './pages/AnalysisPage';
import CommunityPage from './pages/CommunityPage';
import CommunityTabPage from './pages/CommunityTabPage';
import ProfileTabPage from './pages/ProfileTabPage';
import AdventuresPage from './pages/AdventuresPage';
import { useAppState } from './context/AppStateContext';

// Wrap routes with this component to apply proper mobile/desktop layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile } = useAppState();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Only show navbar on non-mobile */}
      {!isMobile && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Mobile tab bar shown only on mobile */}
      {isMobile && <TabBar />}
      
      {/* Footer only shown on non-mobile */}
      {!isMobile && <Footer />}
    </div>
  );
};

// The main app component wrapped with all providers
function AppWithProviders() {
  const { isMobile } = useAppState();

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Three main tab pages for mobile */}
          <Route path="/community" element={<CommunityTabPage />} />
          <Route path="/pets" element={<ProfileTabPage />} />
          <Route path="/adventures" element={<AdventuresPage />} />

          {/* Other pages */}
          <Route path="/" element={isMobile ? <Navigate to="/community" /> : <HomePage />} />
          <Route path="/trails" element={<TrailsPage />} />
          <Route path="/pet/:petId" element={<PetProfilePage />} />
          <Route path="/record" element={<RecordHikePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis/:hikeId" element={<AnalysisPage />} />
          <Route path="/analysis" element={<HistoryPage />} />
          <Route path="/community-legacy" element={<CommunityPage />} />
        </Routes>
      </AppLayout>
      
      <ToastContainer 
        position="bottom-right" 
        theme="colored" 
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
    </Router>
  );
}

// The root component that wraps everything with providers
function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppWithProviders />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;