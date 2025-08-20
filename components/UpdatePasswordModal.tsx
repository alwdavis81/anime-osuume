/// <reference lib="dom" />
import React, { useState } from 'react';
import * as authService from '../services/authService';
import { XIcon } from './Icons';

interface UpdatePasswordModalProps {
  onClose: () => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
        await authService.updatePassword(password);
        setSuccessMessage("Your password has been updated successfully! You can now close this window.");
        setTimeout(() => {
          onClose();
        }, 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-purple-900/40 w-full max-w-md m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors" aria-label="Close dialog">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Update Your Password</h2>
          
          <form onSubmit={handleSubmit}>
            {error && <p className="bg-red-900/50 text-red-300 text-sm p-3 rounded-lg mb-4">{error}</p>}
            {successMessage && <p className="bg-green-900/50 text-green-300 text-sm p-3 rounded-lg mb-4">{successMessage}</p>}
            
            <div className="mb-6">
              <label htmlFor="new-password"  className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 bg-black/30 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                placeholder="Enter your new password"
                disabled={!!successMessage}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !!successMessage} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800/50 disabled:to-indigo-800/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-600/30"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;