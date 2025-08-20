import React, { useState } from 'react';
import * as authService from '../services/authService';
import { XIcon } from './Icons';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (view === 'login') {
        await authService.login(email, password);
        onLoginSuccess();
      } else if (view === 'register') {
        await authService.register(email, password);
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
      } else { // view === 'reset'
        await authService.sendPasswordResetEmail(email);
        setSuccessMessage(`If an account exists for ${email}, a password reset link has been sent.`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchView = (newView: 'login' | 'register' | 'reset') => {
    setView(newView);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
  }

  const getTitle = () => {
    if (view === 'register') return 'Create Account';
    if (view === 'reset') return 'Reset Password';
    return 'Welcome Back';
  }
  
  const getDescription = () => {
    if (view === 'register') return 'Sign up to get started.';
    if (view === 'reset') return 'Enter your email to receive a password reset link.';
    return 'Log in to save your recommendations.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-900/40 w-full max-w-md m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors" aria-label="Close dialog">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">{getTitle()}</h2>
          <p className="text-center text-slate-400 mb-6">{getDescription()}</p>

          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-900/50 text-red-300 text-sm p-3 rounded-lg mb-4">{error}</p>}
            {successMessage && <p className="bg-green-900/50 text-green-300 text-sm p-3 rounded-lg mb-4">{successMessage}</p>}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-black/30 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
              />
            </div>
            
            {view !== 'reset' && (
              <div className="mb-6">
                <label htmlFor="password"  className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 bg-black/30 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                />
              </div>
            )}
            
            {view === 'login' && (
                <div className="text-right mb-4 -mt-2">
                    <button type="button" onClick={() => switchView('reset')} className="text-sm font-medium text-purple-400 hover:text-purple-300">
                        Forgot Password?
                    </button>
                </div>
            )}

            <button type="submit" disabled={isLoading || !!successMessage} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800/50 disabled:to-indigo-800/50 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-600/30">
              {isLoading ? 'Loading...' : (view === 'login' ? 'Log In' : view === 'register' ? 'Sign Up' : 'Send Reset Link')}
            </button>
          </form>
          
          {view === 'reset' ? (
             <p className="text-center text-sm text-slate-400 mt-6">
                Remember your password?
                <button onClick={() => switchView('login')} className="font-semibold text-purple-400 hover:text-purple-300 ml-1">
                    Back to Login
                </button>
            </p>
          ) : (
            <p className="text-center text-sm text-slate-400 mt-6">
              {view === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => switchView(view === 'login' ? 'register' : 'login')} className="font-semibold text-purple-400 hover:text-purple-300 ml-1">
                {view === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginModal;