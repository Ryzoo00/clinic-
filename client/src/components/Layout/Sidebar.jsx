import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, BarChart3, Calendar, FileText, 
  Brain, UserPlus, LogOut, Activity, MessageCircle,
  CreditCard, Download
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Manage Users', path: '/admin/users' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        ];
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
          { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
          { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
          { icon: Brain, label: 'AI Symptom Checker', path: '/doctor/ai-checker' },
        ];
      case 'receptionist':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/receptionist/dashboard' },
          { icon: UserPlus, label: 'Register Patient', path: '/receptionist/register-patient' },
          { icon: Calendar, label: 'Book Appointment', path: '/receptionist/book-appointment' },
          { icon: FileText, label: 'Manage Appointments', path: '/receptionist/appointments' },
          { icon: MessageCircle, label: 'Messages', path: '/receptionist/chat' },
        ];
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
          { icon: FileText, label: 'Prescriptions', path: '/patient/prescriptions' },
          { icon: Calendar, label: 'My Appointments', path: '/patient/appointments' },
          { icon: Brain, label: 'AI Symptom Checker', path: '/patient/ai-checker' },
          { icon: CreditCard, label: 'Payments', path: '/patient/payments' },
          { icon: Download, label: 'Reports', path: '/patient/reports' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-700/50 shadow-glass dark:shadow-dark-glass transform transition-all duration-300 ease-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Premium Logo Section */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl shadow-lg shadow-medical-500/20">
              <Activity className="w-6 h-6 text-white" />
              <div className="absolute -inset-1 bg-gradient-to-br from-medical-400 to-medical-600 rounded-2xl opacity-20 blur-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-gradient">AI Clinic</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-dark-400 font-medium capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-dark-500 uppercase tracking-widest">Main Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-medical-500 to-medical-600 text-white shadow-lg shadow-medical-500/25 font-medium' 
                    : 'text-gray-600 dark:text-dark-300 hover:bg-medical-50/50 dark:hover:bg-dark-800/50 hover:text-medical-700 dark:hover:text-medical-300'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/80"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-dark-700/50">
          <button
            onClick={logout}
            className="group flex items-center gap-3 w-full px-4 py-2.5 text-gray-500 dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
