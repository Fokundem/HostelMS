import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useVerifyEmail, useResetPassword } from '@/hooks/api';

export default function PasswordReset() {
  const [step, setStep] = useState<'email' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const { mutateAsync: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutateAsync: resetPassword, isPending: isResetting } = useResetPassword();

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [step]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const result = await verifyEmail(email);
      if (result.exists) {
        setUserName(result.name || '');
        setStep('newPassword');
      } else {
        setError('No account found with this email address');
      }
    } catch {
      setError('No account found with this email address');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ email, new_password: newPassword });
      setStep('success');
    } catch {
      setError('Failed to reset password. Please try again.');
    }
  };

  // Step 3: Success
  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
        <p className="text-gray-600 mb-6">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-[#1a56db] text-white px-6 py-3 font-semibold hover:bg-[#1e40af] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    );
  }

  // Step 2: Enter New Password
  if (step === 'newPassword') {
    return (
      <form ref={formRef} onSubmit={handleResetPassword} className="space-y-5">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-[#1a56db]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
          {userName && (
            <p className="text-gray-500 text-sm mt-1">
              Resetting password for <span className="text-[#1a56db] font-medium">{userName}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* New Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-sharp pl-10 pr-10"
              required
              minLength={6}
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

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input-sharp pl-10 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isResetting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <button
          type="button"
          onClick={() => { setStep('email'); setError(''); }}
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to email
        </button>
      </form>
    );
  }

  // Step 1: Verify Email
  return (
    <form ref={formRef} onSubmit={handleVerifyEmail} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-[#1a56db]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email to verify your account
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

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

      <button
        type="submit"
        disabled={isVerifying}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {isVerifying ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Email'
        )}
      </button>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
    </form>
  );
}
