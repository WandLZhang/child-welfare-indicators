import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/rit-logo.png" alt="Child Welfare Indicators" className="h-8 w-auto mr-2" />
            <h1 className={`text-xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              Child Welfare Indicators
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <NavLink href="/" label="Home" scrolled={scrolled} />
            <NavLink href="/dashboard" label="Dashboard" scrolled={scrolled} />
            <NavLink href="/about" label="About" scrolled={scrolled} />
          </nav>

          <div className="flex items-center">
            {user ? (
              <UserMenu user={user} signOut={signOut} scrolled={scrolled} />
            ) : (
              <button
                onClick={signIn}
                className={`py-2 px-4 rounded-full transition-colors duration-300 ${
                  scrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Sign In
              </button>
            )}
            <button
              className="md:hidden ml-4 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu toggleMenu={toggleMenu} user={user} signIn={signIn} signOut={signOut} />
      )}
    </header>
  );
};

const NavLink = ({ href, label, scrolled }) => (
  <a
    href={href}
    className={`transition-colors duration-300 ${
      scrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
    }`}
  >
    {label}
  </a>
);

const UserMenu = ({ user, signOut, scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 py-2 px-4 rounded-full transition-colors duration-300 ${
          scrolled
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
        }`}
      >
        <User size={18} />
        <span>{user.displayName || user.email}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            onClick={signOut}
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
  <div className="md:hidden bg-white shadow-lg">
    <nav className="flex flex-col p-4">
      <a href="/" className="py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
        Home
      </a>
      <a href="/dashboard" className="py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
        Dashboard
      </a>
      <a href="/about" className="py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
        About
      </a>
      {user ? (
        <>
          <a href="/profile" className="py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Profile
          </a>
          <a href="/settings" className="py-2 text-gray-800 hover:text-blue-600" onClick={toggleMenu}>
            Settings
          </a>
          <button
            onClick={() => {
              signOut();
              toggleMenu();
            }}
            className="py-2 text-left text-gray-800 hover:text-blue-600"
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            signIn();
            toggleMenu();
          }}
          className="py-2 text-left text-blue-600 hover:text-blue-700"
        >
          Sign In
        </button>
      )}
    </nav>
  </div>
);

export default Header;
