import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Building2, Shield, Users, CreditCard } from 'lucide-react';

export default function AuthLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Wait for auth to load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'hostel_manager') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a56db] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#1a56db]" />
            </div>
              <span className="font-bold text-white text-xl tracking-tight">HostelMS</span>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Modern Hostel<br />Management System
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Streamline your hostel operations with our comprehensive digital platform.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: 'Student Management' },
              { icon: Building2, label: 'Room Allocation' },
              { icon: CreditCard, label: 'Payment Tracking' },
              { icon: Shield, label: 'Secure Access' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 p-3">
                <feature.icon className="w-5 h-5 text-white" />
                <span className="text-white text-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-sm">
          © 2024 Hostel Management System. All rights reserved.
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div ref={containerRef} className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">HostelMS</span>
          </div>

          {/* Auth Card */}
          <div className="bg-white border border-gray-200 shadow-sharp-lg p-6 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
