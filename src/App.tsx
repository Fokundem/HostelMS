import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

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
import StudentRoom from './pages/student/Room';
import StudentPayments from './pages/student/Payments';
import StudentComplaints from './pages/student/Complaints';
import StudentVisitors from './pages/student/Visitors';
import StudentHostels from './pages/student/Hostels';
import StudentManagement from './pages/admin/StudentManagement';
import RoomManagement from './pages/admin/RoomManagement';
import RoomAllocation from './pages/admin/RoomAllocation';
import PaymentManagement from './pages/admin/PaymentManagement';
import Complaints from './pages/admin/Complaints';
import VisitorManagement from './pages/admin/VisitorManagement';
import Reports from './pages/admin/Reports';
import Hostels from './pages/admin/Hostels';
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
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
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
                <Route path="/admin/hostels" element={<Hostels />} />
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
                <Route path="/student/hostels" element={<StudentHostels />} />
                <Route path="/student/room" element={<StudentRoom />} />
                <Route path="/student/payments" element={<StudentPayments />} />
                <Route path="/student/complaints" element={<StudentComplaints />} />
                <Route path="/student/visitors" element={<StudentVisitors />} />
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
