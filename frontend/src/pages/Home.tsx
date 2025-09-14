import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { 
  BarChart3, 
  Brain, 
  Heart, 
  BookOpen, 
  Smartphone, 
  Award,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const features = [
    {
      icon: BarChart3,
      title: 'Unified Wellness Tracker',
      description: 'Track sleep, study hours, activity, mood, diet, and stress all in one place.',
    },
    {
      icon: Brain,
      title: 'AI Conversational Agent',
      description: 'Get personalized tips, motivation, and activity suggestions from our AI assistant.',
    },
    {
      icon: TrendingUp,
      title: 'Personalized Dashboard',
      description: 'Interactive charts and graphs to visualize your wellness journey.',
    },
    {
      icon: BookOpen,
      title: 'Curated Resource Hub',
      description: 'Access articles, videos, and tools for better mental and physical health.',
    },
    {
      icon: Smartphone,
      title: 'Smartwatch Integration',
      description: 'Connect Fitbit, Google Fit, or Apple Health for automatic data sync.',
    },
    {
      icon: Award,
      title: 'Gamification & Rewards',
      description: 'Earn badges, maintain streaks, and unlock guided modules.',
    },
  ];

  const benefits = [
    'Improved sleep quality and duration',
    'Better stress management techniques',
    'Enhanced study productivity',
    'Healthier lifestyle habits',
    'Personalized wellness insights',
    '24/7 AI-powered support',
  ];

  const stats = [
    { label: 'Students Helped', value: '10,000+' },
    { label: 'Wellness Data Points', value: '1M+' },
    { label: 'AI Conversations', value: '50,000+' },
    { label: 'Success Rate', value: '95%' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Platform for Student
              <span className="text-primary-600"> Wellness</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track your mental and physical health, get personalized insights, 
              and build better habits with our comprehensive wellness platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedIn>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </SignedIn>
              <SignedOut>
                <button 
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="btn btn-primary btn-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="btn btn-outline btn-lg"
                >
                  Sign In
                </button>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines tracking, AI insights, and resources 
              to help you achieve your wellness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose ManasFit?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of students who have transformed their wellness journey 
                with our AI-powered platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                <p className="text-primary-100 mb-6">
                  Connect with fellow students on their wellness journey. 
                  Share experiences, get support, and achieve your goals together.
                </p>
                <SignedOut>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                  >
                    Start Your Journey
                  </button>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Data is Safe & Secure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We take your privacy seriously. Your wellness data is encrypted, 
              secure, and never shared without your consent.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Wellness?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their mental and physical health.
          </p>
          <SignedOut>
            <button 
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
            >
              Get Started Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </SignedOut>
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'signup' ? 'Create Your Account' : 'Sign In'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {authMode === 'signup' ? (
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white font-bold',
                      card: 'bg-transparent shadow-none border-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50',
                      formFieldInput: 'border-2 border-gray-300 focus:border-primary-500',
                      footerActionLink: 'text-primary-600 hover:text-primary-700 font-bold',
                      identityPreviewText: 'text-gray-700',
                      formFieldLabel: 'text-gray-700 font-bold',
                      formFieldSuccessText: 'text-green-600 font-bold',
                      formFieldErrorText: 'text-red-600 font-bold'
                    }
                  }}
                  redirectUrl="/dashboard"
                  signInUrl="#"
                  afterSignUpUrl="/dashboard"
                />
              ) : (
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white font-bold',
                      card: 'bg-transparent shadow-none border-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50',
                      formFieldInput: 'border-2 border-gray-300 focus:border-primary-500',
                      footerActionLink: 'text-primary-600 hover:text-primary-700 font-bold',
                      identityPreviewText: 'text-gray-700',
                      formFieldLabel: 'text-gray-700 font-bold'
                    }
                  }}
                  redirectUrl="/dashboard"
                  signUpUrl="#"
                  afterSignInUrl="/dashboard"
                />
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                    className="text-primary-600 hover:text-primary-700 font-bold"
                  >
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
