import React, { useState } from 'react';
import { 
  ChevronRight, User, Mail, Phone, MapPin, 
  Briefcase, Link as LinkIcon, Link2, 
  Lock, LogOut, Save, Camera, CheckCircle2, 
  AlertCircle, LayoutDashboard, FileText, Sparkles, CheckSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';

const MOCK_USER = {
  avatar: 'https://ui-avatars.com/api/?name=Alex+Smith&background=f1f5f9&color=3b82f6&size=200',
  firstName: 'Alex',
  lastName: 'Smith',
  title: 'Senior Software Engineer',
  email: 'alex.smith@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexsmith',
  github: 'github.com/alexsmith',
  portfolio: 'alexsmith.dev'
};

const MOCK_STATS = [
  { label: 'Resume Completion', value: '100%', icon: <FileText size={20} className="text-blue-500" /> },
  { label: 'AI Resume Score', value: '92/100', icon: <Sparkles size={20} className="text-purple-500" /> },
  { label: 'Applications', value: '14', icon: <CheckSquare size={20} className="text-green-500" /> },
  { label: 'Job Matches', value: '28', icon: <Briefcase size={20} className="text-amber-500" /> }
];

const Profile = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    title: MOCK_USER.title,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    location: MOCK_USER.location,
    linkedin: MOCK_USER.linkedin,
    github: MOCK_USER.github,
    portfolio: MOCK_USER.portfolio,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First Name, Last Name, and Email are required fields.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    // Handle password change logic here
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative pb-12">
        
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="font-semibold text-sm">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">Profile</span>
          </nav>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Left Column: Forms */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Header / Basic Info Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={MOCK_USER.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary mb-1">{formData.firstName} {formData.lastName}</h1>
                <p className="text-accent-blue font-semibold mb-3">{formData.title || 'Professional Title'}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-1.5"><Mail size={16} /> {formData.email}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={16} /> {formData.location || 'Add Location'}</div>
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Forms Container */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-8">
              
              {/* Personal Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  <User size={20} className="text-accent-blue" /> Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input 
                      type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-purple-500" /> Professional Profiles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Professional Title</label>
                    <input 
                      type="text" name="title" value={formData.title} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Link2 size={14}/> LinkedIn URL</label>
                    <input 
                      type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Link2 size={14}/> GitHub URL</label>
                    <input 
                      type="text" name="github" value={formData.github} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><LinkIcon size={14}/> Portfolio Website</label>
                    <input 
                      type="text" name="portfolio" value={formData.portfolio} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button Area */}
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="btn btn-primary px-8 py-3.5 flex items-center justify-center gap-2 shadow-sm min-w-[160px]"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Save size={18} /> Save Changes</>
                  )}
                </button>
              </div>

            </form>

            {/* Account Settings (Password) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mt-4">
              <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <Lock size={20} className="text-slate-600" /> Account Security
              </h2>
              
              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 border-b border-slate-100 pb-8">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Current Password</label>
                  <input 
                    type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <input 
                    type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <input 
                    type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 outline-none transition-all text-text-primary text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end mt-2">
                  <button type="button" className="btn btn-secondary px-6 py-2.5 font-semibold text-sm">Update Password</button>
                </div>
              </form>

              <div>
                <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-xs text-text-secondary mb-4">Logging out will end your current session. You will need to log back in to access your dashboard.</p>
                <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 flex items-center gap-2 transition-colors text-sm">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Stats & Quick Links */}
          <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-text-primary mb-6 border-b border-slate-100 pb-3">Your Career Stats</h3>
              
              <div className="flex flex-col gap-5">
                {MOCK_STATS.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        {stat.icon}
                      </div>
                      <span className="text-sm font-semibold text-text-secondary">{stat.label}</span>
                    </div>
                    <span className="font-bold text-text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                <Link to="/resume" className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-text-primary rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200">
                  <FileText size={16} /> Edit Resume
                </Link>
                <Link to="/applications" className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-text-primary rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200">
                  <LayoutDashboard size={16} /> View Applications
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
