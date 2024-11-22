import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/rit-logo.png" alt="Child Welfare Indicators" className="h-10 w-auto" />
            <h1 className="text-2xl font-semibold">
              Child Welfare Indicators
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/about" label="About" />
            {user ? (
              <UserMenu user={user} signOut={signOut} />
            ) : (
              <button
                onClick={signIn}
                className="py-2 px-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                Sign In
              </button>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu toggleMenu={toggleMenu} user={user} signIn={signIn} signOut={signOut} />
      )}
    </header>
  );
};

const NavLink = ({ href, label }) => (
  <a
    href={href}
    className="text-gray-200 hover:text-white transition-colors duration-300 text-lg"
  >
    {label}
  </a>
);

const UserMenu = ({ user, signOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 py-2 px-4 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors duration-300"
      >
        <User size={20} />
        <span>{user.displayName || user.email}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ toggleMenu, user, signIn, signOut }) => (
  <div className="md:hidden bg-blue-800">
    <nav className="flex flex-col p-4 space-y-4">
      <a href="/" className="text-white hover:text-blue-200" onClick={toggleMenu}>
        Home
      </a>
      <a href="/dashboard" className="text-white hover:text-blue-200" onClick={toggleMenu}>
        Dashboard
      </a>
      <a href="/about" className="text-white hover:text-blue-200" onClick={toggleMenu}>
        About
      </a>
      {user ? (
        <button
          onClick={() => {
            signOut();
            toggleMenu();
          }}
          className="text-left text-white hover:text-blue-200"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => {
            signIn();
            toggleMenu();
          }}
          className="text-left text-blue-200 hover:text-white"
        >
          Sign In
        </button>
      )}
    </nav>
  </div>
);

export default Header;