import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-6 ${isScrolled ? 'py-4 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm' : ''}`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-xl text-text-primary tracking-tight">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xl shadow-md">C</div>
          <span>CareerAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text-primary font-medium text-[0.95rem]">Home</Link>
          <a href="/#features" className="text-text-secondary hover:text-text-primary font-medium text-[0.95rem] transition-colors">Features</a>
          <a href="/#how-it-works" className="text-text-secondary hover:text-text-primary font-medium text-[0.95rem] transition-colors">How It Works</a>
          <a href="/#jobs" className="text-text-secondary hover:text-text-primary font-medium text-[0.95rem] transition-colors">Jobs</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="font-semibold text-text-primary hover:text-accent-blue transition-colors">Login</Link>
          <Link to="/register" className="btn btn-primary">
            <Sparkles size={18} />
            Build My Resume
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white p-6 shadow-lg border-b border-slate-200 flex flex-col gap-4 md:hidden"
          >
            <Link to="/" className="font-medium text-text-secondary py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="/#features" className="font-medium text-text-secondary py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="/#how-it-works" className="font-medium text-text-secondary py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="/#jobs" className="font-medium text-text-secondary py-2" onClick={() => setMobileMenuOpen(false)}>Jobs</a>
            <Link to="/login" className="font-semibold text-text-primary mt-2 border-t border-slate-200 pt-4" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
              Build My Resume
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
