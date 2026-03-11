import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PasswordReset from './pages/auth/PasswordReset';
import AdminDashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import RoomManagement from './pages/admin/RoomManagement';
import RoomAllocation from './pages/admin/RoomAllocation';
import PaymentManagement from './pages/admin/PaymentManagement';
import Complaints from './pages/admin/Complaints';
import VisitorManagement from './pages/admin/VisitorManagement';
import Reports from './pages/admin/Reports';
import Profile from './pages/shared/Profile';
import Notifications from './pages/shared/Notifications';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1310] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e7f87c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#f4f4f4] text-lg font-medium">Loading Hostel Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password-reset" element={<PasswordReset />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<DashboardLayout role="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<StudentManagement />} />
                <Route path="/admin/rooms" element={<RoomManagement />} />
                <Route path="/admin/allocations" element={<RoomAllocation />} />
                <Route path="/admin/payments" element={<PaymentManagement />} />
                <Route path="/admin/complaints" element={<Complaints />} />
                <Route path="/admin/visitors" element={<VisitorManagement />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/profile" element={<Profile />} />
                <Route path="/admin/notifications" element={<Notifications />} />
              </Route>

              {/* Student Routes */}
              <Route element={<DashboardLayout role="student" />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/student/notifications" element={<Notifications />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
