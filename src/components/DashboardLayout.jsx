import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Sparkles, Briefcase, 
  CheckSquare, User, LogOut, Search, Bell, Menu, X
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobile, closeMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Resume Builder', path: '/resume', icon: <FileText size={20} /> },
    { name: 'AI Improve', path: '/ai-improve', icon: <Sparkles size={20} /> },
    { name: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/applications', icon: <CheckSquare size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className={`bg-white h-full border-r border-slate-200 flex flex-col ${isMobile ? 'w-64' : 'w-64 hidden lg:flex shrink-0'}`}>
      <div className="p-6">
        <Link to="/" onClick={closeMobile} className="flex items-center gap-3 font-extrabold text-xl text-text-primary tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-md">C</div>
          <span>CareerAI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              onClick={closeMobile}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-accent-blue-light text-accent-blue font-semibold' 
                  : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-4 py-3 w-full text-left text-text-secondary hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Header = ({ setMobileMenuOpen }) => (
  <header className="bg-white border-b border-slate-200 h-20 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
    <div className="flex items-center gap-4">
      <button className="lg:hidden text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(true)}>
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold hidden sm:block text-text-primary">Good morning, Alex 👋</h1>
    </div>
    
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="relative hidden md:block">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
        <input type="text" placeholder="Search jobs, companies..." className="pl-10 pr-4 py-2 bg-bg-secondary border border-slate-200 rounded-full text-sm focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 w-64 transition-all" />
      </div>
      
      <button className="relative text-text-secondary hover:text-text-primary transition-colors">
        <Bell size={24} />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
        <img src="https://ui-avatars.com/api/?name=Alex+Smith&background=f1f5f9&color=3b82f6" alt="Alex" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

const DashboardLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-secondary flex font-sans text-text-primary overflow-hidden">
      <Sidebar isMobile={false} />

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden h-full"
            >
              <Sidebar isMobile={true} closeMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-secondary relative">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
