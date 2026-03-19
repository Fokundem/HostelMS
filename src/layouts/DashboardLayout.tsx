import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  LayoutDashboard,
  Users,
  Building2,
  BedDouble,
  CreditCard,
  MessageSquare,
  UserCheck,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Home,
} from 'lucide-react';

interface DashboardLayoutProps {
  role: 'admin' | 'student';
}

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Building2, label: 'Hostels', href: '/admin/hostels' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: Building2, label: 'Rooms', href: '/admin/rooms' },
  { icon: BedDouble, label: 'Allocations', href: '/admin/allocations' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: MessageSquare, label: 'Complaints', href: '/admin/complaints' },
  { icon: UserCheck, label: 'Visitors', href: '/admin/visitors' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
];

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
  { icon: Building2, label: 'Hostels', href: '/student/hostels' },
  { icon: BedDouble, label: 'My Room', href: '/student/room' },
  { icon: CreditCard, label: 'Payments', href: '/student/payments' },
  { icon: MessageSquare, label: 'Complaints', href: '/student/complaints' },
  { icon: UserCheck, label: 'Visitors', href: '/student/visitors' },
];

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Use authenticated user's role
  const userRole = user?.role || role;
  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;
  const basePath = userRole === 'admin' ? '/admin' : '/student';

  // Navigation matching is handled below.

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  // Wait for auth to load before making routing decisions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && role) {
    const isUserAdmin = user.role === 'admin' || user.role === 'hostel_manager';
    const isRouteAdmin = role === 'admin';
    
    if (isUserAdmin !== isRouteAdmin) {
      return <Navigate to={isUserAdmin ? '/admin/dashboard' : '/student/dashboard'} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Link to={basePath + '/dashboard'} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-gray-900 text-lg transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              HostelMS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all ${isActive
                    ? 'bg-[#1a56db] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <Link
            to={basePath + '/profile'}
            className={`flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors ${location.pathname === basePath + '/profile' ? 'bg-gray-100' : ''
              }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Profile
            </span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 w-48"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              to={basePath + '/notifications'}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-[#1a56db] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-sharp-lg py-2 z-50">
                  <Link
                    to={basePath + '/profile'}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main ref={contentRef} className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
