
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, UserRole } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminDashboard from './pages/AdminDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import MerchantPolicyPage from './pages/MerchantPolicyPage';
import RiderPolicyPage from './pages/RiderPolicyPage';
import PaymentPage from './pages/PaymentPage';
import GlobalBackground from './components/GlobalBackground';
import ScrollToTop from './components/ScrollToTop';

// Simple Auth Provider Logic
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('eln_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Failed to parse saved user:', error);
      localStorage.removeItem('eln_current_user');
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('eln_current_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eln_current_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <GlobalBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eln"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <GlobalBackground />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/merchant-policy" element={<MerchantPolicyPage />} />
        <Route path="/rider-policy" element={<RiderPolicyPage />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignupPage onSignup={login} />} />
        <Route path="/admin-login" element={<LoginPage onLogin={login} isAdminOnly />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage user={currentUser} />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            currentUser?.role === UserRole.ADMIN ? (
              <AdminDashboard user={currentUser} onLogout={logout} />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        <Route
          path="/merchant-dashboard/*"
          element={
            currentUser?.role === UserRole.MERCHANT ? (
              <MerchantDashboard user={currentUser} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/rider-dashboard/*"
          element={
            currentUser?.role === UserRole.RIDER ? (
              <RiderDashboard user={currentUser} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
