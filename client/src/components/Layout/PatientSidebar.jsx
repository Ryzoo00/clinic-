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
  MessageCircle
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
    <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200/80 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo & Branding */}
        <div className="px-6 py-6 bg-gradient-to-r from-medical-600 to-medical-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Clinic</h1>
              <p className="text-xs text-medical-100 font-medium">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="px-4 -mt-2">
          <div className="bg-gradient-to-br from-medical-50 to-white p-4 rounded-xl border border-medical-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-medical-500 to-medical-600 text-white shadow-lg shadow-medical-500/30' 
                    : 'text-gray-700 hover:bg-medical-50 hover:text-medical-700'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
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
