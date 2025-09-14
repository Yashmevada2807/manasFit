import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useWellnessStore } from './store/wellnessStore';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Get Clerk publishable key
const clerkPubKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key")
}

function AppContent() {
  const { user } = useUser();
  const { getDashboardData, getGoals } = useWellnessStore();

  // Initialize app data when user is authenticated
  useEffect(() => {
    if (user) {
      // Load dashboard data and goals
      getDashboardData();
      getGoals();
    }
  }, [user, getDashboardData, getGoals]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
      {/* <Navbar />   */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <>
                <SignedIn>
                  <Resources />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <>
                <SignedIn>
                  <Profile />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      
      {/* Chatbot - only show when authenticated */}
      <SignedIn>
        <Chatbot />
      </SignedIn>
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
