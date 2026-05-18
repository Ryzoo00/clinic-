import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, BarChart3, Calendar, FileText, 
  Brain, UserPlus, LogOut, Activity, MessageCircle
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
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-medical-100 rounded-lg">
            <Activity className="w-6 h-6 text-medical-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Clinic</h1>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-medical-50 text-medical-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
