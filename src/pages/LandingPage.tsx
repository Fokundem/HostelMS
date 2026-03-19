import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Shield,
  Users,
  Building2,
  CreditCard,
  MessageSquare,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Home,
  Lock,
  Zap,
  Menu,
  X,
  Bed,
  Wifi,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'Role-based access control with JWT tokens and password hashing for maximum security.',
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Complete CRUD operations for student records with detailed profile management.',
  },
  {
    icon: Building2,
    title: 'Room Allocation',
    description: 'Smart room assignment system with capacity tracking and automatic allocation.',
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description: 'Digital payment management with history, receipts, and outstanding balance tracking.',
  },
  {
    icon: MessageSquare,
    title: 'Complaint System',
    description: 'Streamlined maintenance requests with status tracking and admin responses.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Comprehensive dashboards with charts and insights for data-driven decisions.',
  },
];

const stats = [
  { value: '500+', label: 'Students Managed' },
  { value: '120', label: 'Rooms Available' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Hero Animation
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('.hero-animate');
      gsap.fromTo(
        heroElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }

    // Features Animation
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('.feature-card');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
            },
            delay: index * 0.05,
          }
        );
      });
    }

    // Stats Animation
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      gsap.fromTo(
        statItems,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">HostelMS</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">Features</button>
              <button onClick={() => scrollToSection('stats')} className="text-gray-600 hover:text-gray-900 transition-colors">Stats</button>
              <button onClick={() => scrollToSection('security')} className="text-gray-600 hover:text-gray-900 transition-colors">Security</button>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#1a56db] text-white px-4 py-2 font-medium hover:bg-[#1e40af] transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block text-gray-600 py-2 w-full text-left">Features</button>
              <button onClick={() => scrollToSection('stats')} className="block text-gray-600 py-2 w-full text-left">Stats</button>
              <button onClick={() => scrollToSection('security')} className="block text-gray-600 py-2 w-full text-left">Security</button>
              <hr className="border-gray-200" />
              <Link to="/login" className="block text-gray-600 py-2">Sign In</Link>
              <Link to="/register" className="block bg-[#1a56db] text-white px-4 py-2 text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="hero-animate inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 mb-6">
                <Zap className="w-4 h-4 text-[#1a56db]" />
                <span className="text-sm text-[#1a56db] font-medium">Modern Hostel Management</span>
              </div>
              <h1 className="hero-animate text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Digital Hostel
                <span className="text-[#1a56db]"> Operations</span>
                <br />Made Simple
              </h1>
              <p className="hero-animate text-lg text-gray-600 mb-8 max-w-xl">
                A comprehensive platform for managing students, rooms, payments, complaints, 
                and administration with advanced automation and security features.
              </p>
              <div className="hero-animate flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-[#1a56db] text-white px-8 py-4 font-semibold hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-4 font-semibold hover:border-gray-300 transition-colors flex items-center justify-center"
                >
                  View Demo
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-animate">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1a56db] to-[#7c3aed] opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white border border-gray-200 shadow-sharp-lg p-2">
                  <img
                    src="/images/hostel-exterior.png"
                    alt="Modern university hostel building exterior"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">🏠 Modern Hostel Facilities</p>
                    <p className="text-xs text-gray-500">State-of-the-art student accommodation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 mb-6">
              <Building2 className="w-4 h-4 text-[#1a56db]" />
              <span className="text-sm text-[#1a56db] font-medium">Our Facilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Experience Premium Living
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern, comfortable, and secure hostel spaces designed for academic 
              success and student well-being.
            </p>
          </div>

          {/* Bento Grid Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Featured Image */}
            <div className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden border border-gray-200">
              <img
                src="/images/hostel-exterior.png"
                alt="Hostel building exterior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ minHeight: '400px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-[#1a56db] text-white text-xs font-semibold px-3 py-1 mb-3">BUILDING</span>
                <h3 className="text-2xl font-bold text-white mb-1">Modern Architecture</h3>
                <p className="text-white/80 text-sm">Contemporary design with top-tier amenities and landscaped surroundings</p>
              </div>
            </div>

            {/* Room Image */}
            <div className="relative group overflow-hidden border border-gray-200">
              <img
                src="/images/hostel-room.png"
                alt="Comfortable hostel room"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block bg-emerald-500 text-white text-xs font-semibold px-3 py-1 mb-2">ROOMS</span>
                <h3 className="text-lg font-bold text-white">Comfortable Rooms</h3>
                <p className="text-white/80 text-xs">Fully furnished with study desks & storage</p>
              </div>
            </div>

            {/* Common Area Image */}
            <div className="relative group overflow-hidden border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80&auto=format"
                alt="Hostel common area and lounge"
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block bg-violet-500 text-white text-xs font-semibold px-3 py-1 mb-2">LOUNGE</span>
                <h3 className="text-lg font-bold text-white">Common Areas</h3>
                <p className="text-white/80 text-xs">Social spaces for relaxation & collaboration</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Bed, label: 'Single & Double Rooms', value: '120+', color: 'text-[#1a56db]' },
              { icon: Wifi, label: 'Free Wi-Fi', value: '24/7', color: 'text-emerald-500' },
              { icon: ShieldCheck, label: 'Security', value: 'CCTV', color: 'text-violet-500' },
              { icon: Sparkles, label: 'Housekeeping', value: 'Daily', color: 'text-amber-500' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 p-4 text-center hover:border-[#1a56db] hover:bg-blue-50/50 transition-all duration-300"
              >
                <div className="flex justify-center mb-2">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#1a56db] mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to streamline hostel operations 
              and enhance the student experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white border border-gray-200 p-6 hover:shadow-sharp transition-shadow hover:border-gray-300"
              >
                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#1a56db]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 mb-6">
                <Lock className="w-4 h-4 text-[#1a56db]" />
                <span className="text-sm text-[#1a56db] font-medium">Enterprise Security</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Security You Can Trust
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built with industry-standard security practices to protect sensitive student 
                and administrative data.
              </p>
              <div className="space-y-3">
                {[
                  'Password hashing with bcrypt',
                  'JWT authentication tokens',
                  'Role-based access control',
                  'Data validation and sanitization',
                  'Secure session management',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sharp p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Security Status</h3>
                  <p className="text-emerald-600 font-medium">All Systems Protected</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Authentication', status: 'Active' },
                  { label: 'Encryption', status: '256-bit' },
                  { label: 'Firewall', status: 'Enabled' },
                  { label: 'Monitoring', status: '24/7' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-[#1a56db] text-sm font-medium">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#1a56db] p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Hostel?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Join hundreds of institutions already using HostelMS to streamline 
              their operations and improve student satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-[#1a56db] px-8 py-4 font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a56db] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">HostelMS</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link to="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 Hostel Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
