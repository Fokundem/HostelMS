import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, UserCircle, Shield, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, role);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#1a56db] flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
            role === 'student'
              ? 'border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 transition-all ${
            role === 'admin'
              ? 'border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Shield className="w-5 h-5" />
          Admin
        </button>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input-sharp pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 border-gray-300 text-[#1a56db] focus:ring-[#1a56db]" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link to="/password-reset" className="text-sm text-[#1a56db] hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Register Link */}
      <p className="text-center text-gray-500 text-sm pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#1a56db] hover:underline font-medium">
          Create account
        </Link>
      </p>

      {/* Demo Credentials */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-xs text-gray-400 text-center mb-3">Demo Credentials</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 border border-gray-200 p-2.5 text-gray-600">
            <span className="text-[#1a56db] font-medium">Admin:</span> admin@hostel.com
          </div>
          <div className="bg-gray-50 border border-gray-200 p-2.5 text-gray-600">
            <span className="text-[#1a56db] font-medium">Student:</span> student@hostel.com
          </div>
        </div>
      </div>
    </form>
  );
}
