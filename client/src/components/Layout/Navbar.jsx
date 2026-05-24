import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, User, Moon, Sun, Bell } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-gray-200/50 dark:border-dark-700/50 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
        {/* Left: Mobile Menu */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 text-gray-600 dark:text-dark-300"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 text-gray-500 dark:text-dark-400 group"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className="relative w-5 h-5">
              <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
              }`} />
              <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                dark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`} />
            </div>
          </button>

          {/* Notification Bell */}
          <button className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 text-gray-500 dark:text-dark-400">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-glow border-2 border-white dark:border-dark-900"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 ml-2 border-l border-gray-200 dark:border-dark-700">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-100">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-dark-400 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-medical-500/20">
              {user?.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
