import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  Bell, 
  Search,
  User,
  Moon,
  Sun
} from 'lucide-react';

const PatientNavbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-gray-200/50 dark:border-dark-700/50 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-all duration-200 text-gray-600 dark:text-dark-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Premium Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-dark-400 transition-colors group-focus-within:text-medical-500" />
              <input
                type="text"
                placeholder="Search prescriptions, appointments..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 dark:bg-dark-800/50 border border-gray-200/50 dark:border-dark-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-400 dark:focus:border-medical-500 transition-all duration-200 text-sm text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
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
              <p className="text-xs text-gray-500 dark:text-dark-400">ID: #{user?._id?.slice(-6).toUpperCase()}</p>
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

export default PatientNavbar;
