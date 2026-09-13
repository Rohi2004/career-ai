import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [serverError, setServerError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!validateEmail(value)) error = 'Please enter a valid email address';
    } else if (name === 'password') {
      if (!value) error = 'Password is required';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');
    setServerError('');
    
    try {
      const res = await login(formData.email, formData.password);
      
      if (res.success) {
        if (res.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setStatus('error');
        setServerError(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setServerError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-400/10 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10 relative z-10">
          
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl text-text-primary tracking-tight mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xl shadow-md">C</div>
              <span>CareerAI</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">Welcome Back</h1>
            <p className="text-text-secondary text-center text-sm">
              Continue building your career with AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {serverError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-300 focus:border-accent-blue focus:ring-accent-blue/20'} outline-none focus:ring-4 transition-all bg-bg-secondary`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-300 focus:border-accent-blue focus:ring-accent-blue/20'} outline-none focus:ring-4 transition-all bg-bg-secondary`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-start gap-1"><AlertCircle size={12} className="shrink-0 mt-0.5"/>{errors.password}</p>}
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer peer appearance-none checked:bg-accent-blue checked:border-accent-blue transition-all"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-accent-blue hover:underline">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="btn btn-primary w-full mt-4 justify-center py-3.5 relative overflow-hidden"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Logging in...
                </span>
              ) : 'Login'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="px-4 text-sm text-text-secondary">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Button placeholder */}
            <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-text-primary font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account? <Link to="/register" className="font-semibold text-accent-blue hover:underline">Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
