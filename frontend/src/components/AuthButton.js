import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, LogIn } from 'lucide-react';

const AuthButton = () => {
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      // Consider implementing a toast notification here
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
      // Consider implementing a toast notification here
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors duration-300"
        >
          <User size={18} />
          <span className="max-w-[150px] truncate">{user.displayName || user.email}</span>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={18} className="inline mr-2" />
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
    >
      <LogIn size={18} />
      <span>Sign In</span>
    </button>
  );
};

export default AuthButton;
