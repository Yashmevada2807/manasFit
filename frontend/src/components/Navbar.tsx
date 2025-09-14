import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BarChart3,
  BookOpen
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ManasFit</span>
          </Link>

          {/* Desktop Navigation */}
          <SignedIn>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SignedIn>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              {/* Clerk UserButton */}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-white border-4 border-brutal-black",
                    userButtonPopoverActionButton: "text-brutal-black hover:bg-mongo-50 font-bold",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </button>
              </div>
            </SignedOut>

            {/* Mobile menu button */}
            <SignedIn>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </SignedIn>
          </div>
        </div>

        {/* Mobile Navigation */}
        <SignedIn>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </SignedIn>
      </div>

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
    </nav>
  );
};

export default Navbar;
