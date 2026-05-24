import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-medical-600 via-medical-700 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-medical-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-medical-400 to-medical-600 rounded-2xl shadow-2xl shadow-medical-500/30 mb-5 animate-float">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-dark-400 mt-2">Sign in to AI Clinic Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1.5 text-medical-500" />
                Email Address
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@clinic.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                <Lock className="w-4 h-4 inline mr-1.5 text-medical-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full py-3.5 text-base group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-dark-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-medical-600 dark:text-medical-400 hover:text-medical-700 dark:hover:text-medical-300 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 glass rounded-2xl border border-medical-100/50 dark:border-medical-800/50">
            <p className="text-xs font-semibold text-gray-700 dark:text-dark-300 mb-3 flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-medical-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-500"></span>
              </span>
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2.5">
                <p className="font-medium text-medical-700 dark:text-medical-300">Admin</p>
                <p className="text-gray-500 dark:text-dark-400 mt-0.5">admin@clinic.com</p>
                <p className="text-gray-400 dark:text-dark-500">admin123</p>
              </div>
              <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2.5">
                <p className="font-medium text-medical-700 dark:text-medical-300">Doctor</p>
                <p className="text-gray-500 dark:text-dark-400 mt-0.5">doctor@clinic.com</p>
                <p className="text-gray-400 dark:text-dark-500">doctor123</p>
              </div>
              <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2.5">
                <p className="font-medium text-medical-700 dark:text-medical-300">Receptionist</p>
                <p className="text-gray-500 dark:text-dark-400 mt-0.5">receptionist@clinic.com</p>
                <p className="text-gray-400 dark:text-dark-500">receptionist123</p>
              </div>
              <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-2.5">
                <p className="font-medium text-medical-700 dark:text-medical-300">Patient</p>
                <p className="text-gray-500 dark:text-dark-400 mt-0.5">patient@clinic.com</p>
                <p className="text-gray-400 dark:text-dark-500">patient123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
