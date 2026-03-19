import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, Building, CheckCircle, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    level: '',
    matricule: '',
    guardianName: '',
    guardianPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.department || !formData.level || !formData.matricule) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.guardianName || !formData.guardianPhone) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsLoading(true);
    setError('');

    try {
      await register(
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          level: formData.level,
          matricule: formData.matricule,
          guardianContact: formData.guardianPhone,
          role: 'STUDENT',
        },
        formData.password
      );
      navigate('/student/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center text-sm font-semibold transition-colors ${
              s === step
                ? 'bg-[#1a56db] text-white'
                : s < step
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s < step ? <CheckCircle className="w-4 h-4" /> : s}
          </div>
          {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+237 677 888 888"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Matricule Number *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            placeholder="HT2024001"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Department *</label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="input-sharp pl-10 appearance-none"
            required
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">Business Admin</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Law">Law</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Level *</label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="input-sharp pl-10 appearance-none"
            required
          >
            <option value="">Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Guardian/Parent Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            placeholder="Enter guardian name"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Guardian/Parent Phone *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="guardianPhone"
            value={formData.guardianPhone}
            onChange={handleChange}
            placeholder="+237 677 999 999"
            className="input-sharp pl-10"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password (min 8 characters)"
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="input-sharp pl-10 pr-10"
            required
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
      <div className="bg-gray-50 p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Password requirements:</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li className={formData.password.length >= 8 ? 'text-emerald-600' : ''}>• At least 8 characters</li>
          <li>• At least one uppercase letter</li>
          <li>• At least one number</li>
        </ul>
      </div>
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Step {step} of 4</p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[200px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 btn-secondary"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 btn-primary"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        )}
      </div>

      {/* Login Link */}
      <p className="text-center text-gray-500 text-sm pt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1a56db] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
