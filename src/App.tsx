import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context providers
import { ThemeProvider } from './context/ThemeContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';

// Layout components
import { Navbar, Footer, TabBar } from './components/layout';

// Pages
import { HomePage } from './pages';
import { 
  RecordHikePage, 
  HistoryPage, 
  AnalysisPage, 
  TrackingTestPage 
} from './pages/activity';
import { TrailsPage } from './pages/trail';
import { PetProfilePage } from './pages/pet';
import { CommunityPage } from './pages/community';
import { ProfileTabPage, CommunityTabPage } from './pages';
import SupabaseTest from './pages/SupabaseTest';
import ReactQueryTest from './pages/ReactQueryTest';

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
  
  console.log('AppWithProviders - isMobile:', isMobile);

  return (
    <Router>
      <AppLayout>
        <div style={{ padding: '10px', background: '#f0f0f0', display: isMobile ? 'block' : 'none' }}>
          Mobile Mode: {isMobile ? 'ON' : 'OFF'} | 
          <a href="/profile" style={{ marginLeft: '10px', color: 'blue' }}>Profile</a> | 
          <a href="/trails" style={{ marginLeft: '10px', color: 'blue' }}>Trails</a> | 
          <a href="/community" style={{ marginLeft: '10px', color: 'blue' }}>Community</a> |
          <a href="/supabase-test" style={{ marginLeft: '10px', color: 'blue' }}>Supabase</a> |
          <a href="/react-query-test" style={{ marginLeft: '10px', color: 'blue' }}>React Query</a>
        </div>
        
        <Routes>
          {/* Universal routes that work on both mobile and desktop */}
          <Route path="/community" element={<CommunityTabPage />} />
          <Route path="/profile" element={<ProfileTabPage />} />
          <Route path="/trails" element={<TrailsPage />} />

          {/* Home page redirects to community on mobile, shows homepage on desktop */}
          <Route path="/" element={isMobile ? <Navigate to="/community" /> : <HomePage />} />
          
          {/* These routes are accessible from the Trails tab on mobile */}
          <Route path="/record" element={<RecordHikePage />} />
          
          {/* These routes are accessible from the Profile tab on mobile */}
          <Route path="/pet/:petId" element={<PetProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis/:hikeId" element={<AnalysisPage />} />
          <Route path="/analysis" element={<HistoryPage />} />
          
          {/* Legacy route */}
          <Route path="/community-legacy" element={<CommunityPage />} />

          {/* New route for tracking test page */}
          <Route path="/tracking-test" element={<TrackingTestPage />} />
          
          {/* Supabase test pages */}
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route path="/react-query-test" element={<ReactQueryTest />} />
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