import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';

const Header = () => {
  const { user, signIn, signOut } = useAuth();

  const UserMenu = ({ user, signOut }) => (
    <button
      onClick={signOut}
      className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors duration-300"
    >
      <User size={18} />
      <span className="max-w-[150px] truncate">{user.displayName || user.email}</span>
    </button>
  );

  const SignInButton = ({ signIn }) => (
    <button
      onClick={signIn}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors duration-300"
    >
      <span>Sign In</span>
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900 text-white shadow-lg">
      <div className="max-w-screen-2xl mx-auto pl-4 pr-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 h-full">
            <img 
              src="/rit-logo.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain my-auto" 
            />
            <h1 className="text-xl font-semibold tracking-wide my-auto">
              Child Welfare Indicators
            </h1>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <UserMenu user={user} signOut={signOut} />
            ) : (
              <SignInButton signIn={signIn} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;