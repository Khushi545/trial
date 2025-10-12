import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, BookDown as Bowl } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onAuthSuccess: (userData: { email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess: _onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email.trim(), password);
        if (success) {
          // Don't call onAuthSuccess immediately - let Firebase auth state change handle it
          console.log('Login successful, Firebase will handle state update');
        } else {
          setError('Invalid email or password. Please check your credentials.');
        }
      } else {
        const success = await register(email.trim(), password);
        if (success) {
          setError('Registration successful! Please login now.');
          setIsLogin(true);
          setPassword('');
        } else {
          setError('Registration failed. Email might already be in use.');
        }
      }
    } catch (_err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-500/30 via-orange-500/30 to-pink-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bowl className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-heading mb-2">
            Welcome to RasoiMate
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                placeholder="Enter your password (min 6 characters)"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-4 rounded-2xl text-sm font-medium ${
              error.includes('successful') 
                ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/40' 
                : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800/40'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                }}
                className="ml-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>
        
        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800/40">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            <strong>Firebase Auth:</strong> Create a new account or sign in with existing credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;