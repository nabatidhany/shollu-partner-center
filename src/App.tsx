import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CardRequest from './pages/satgas/CardRequest';
import MemberRegistration from './pages/satgas/MemberRegistration';
import Attendance from './pages/satgas/Attendance';
import PrintCards from './pages/satgas/PrintCards';
import MemberList from './pages/satgas/MemberList';
import Settings from './pages/satgas/Settings';
import MasjidManagement from './pages/satgas/MasjidManagement';
import SatgasManagement from './pages/admin/SatgasManagement';
import SatgasRequests from './pages/admin/SatgasRequests';
import MasjidRequests from './pages/admin/MasjidRequests';
import MasjidEditRequests from './pages/admin/MasjidEditRequests';
import CardPrintRequests from './pages/admin/CardPrintRequests';
import RegisterSatgas from './pages/satgas/RegisterSatgas';
import ComingSoon from './pages/ComingSoon';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only redirect to /dashboard if adminOnly is true and user is not admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Do not redirect to /dashboard for non-adminOnly routes
  return <>{children}</>;
};

const AuthenticatedApp: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Satgas Routes */}
        <Route path="/card-request" element={<CardRequest />} />
        <Route path="/member-registration" element={<MemberRegistration />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/print-cards" element={<ComingSoon />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/masjid-management" element={<ComingSoon />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Admin Routes */}
        <Route 
          path="/satgas-management" 
          element={
            <ProtectedRoute adminOnly>
              <ComingSoon />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/satgas-requests" 
          element={
            <ProtectedRoute adminOnly>
              <SatgasRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/card-print-requests" 
          element={
            <ProtectedRoute adminOnly>
              <CardPrintRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/masjid-requests" 
          element={
            <ProtectedRoute adminOnly>
              <MasjidRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/masjid-edit-requests" 
          element={
            <ProtectedRoute adminOnly>
              <MasjidEditRequests />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-satgas" element={<RegisterSatgas />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 lg:p-8">
      <LoginForm />
    </div>
  );
};

export default App;