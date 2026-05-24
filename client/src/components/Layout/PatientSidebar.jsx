import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  HeartPulse, 
  User, 
  LogOut,
  Activity,
  MessageCircle,
  CreditCard,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const PatientSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: FileText, label: 'My Prescriptions', path: '/patient/prescriptions' },
    { icon: CalendarDays, label: 'Appointments', path: '/patient/appointments' },
    { icon: HeartPulse, label: 'Medical Records', path: '/patient/medical-history' },
    { icon: CreditCard, label: 'Payments', path: '/patient/payments' },
    { icon: Download, label: 'My Reports', path: '/patient/reports' },
    { icon: MessageCircle, label: 'Messages', path: '/patient/chat' },
    { icon: User, label: 'Profile', path: '/patient/profile' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    onClose();
  };

  return (
    <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-700/50 shadow-glass dark:shadow-dark-glass transform transition-all duration-300 ease-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Premium Logo + Gradient Header */}
        <div className="px-6 py-6 bg-gradient-to-br from-medical-600 to-medical-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_60%)]"></div>
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Clinic</h1>
              <p className="text-xs text-medical-100 font-medium">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 -mt-3">
          <div className="glass-card-static py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-medical-500/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-dark-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-dark-500 uppercase tracking-widest">Menu</p>
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
                <span className="font-medium">{item.label}</span>
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
            onClick={handleLogout}
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

export default PatientSidebar;
