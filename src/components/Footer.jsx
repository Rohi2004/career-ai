import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <a href="#" className="flex items-center gap-3 font-extrabold text-xl text-text-primary tracking-tight mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-md">C</div>
              <span>CareerAI</span>
            </a>
            <p className="text-text-secondary max-w-[300px]">
              Empowering professionals to achieve their career goals through intelligent tools and personalized insights.
            </p>
          </div>
          
          <div>
            <div className="font-bold text-text-primary mb-6">Platform</div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Resume Builder</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Job Search</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Application Tracker</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Cover Letter Generator</a>
            </div>
          </div>
          
          <div>
            <div className="font-bold text-text-primary mb-6">Resources</div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Career Blog</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Resume Templates</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Interview Prep</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Help Center</a>
            </div>
          </div>
          
          <div>
            <div className="font-bold text-text-primary mb-6">Company</div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">About Us</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Careers</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Privacy Policy</a>
              <a href="#" className="text-text-secondary hover:text-accent-blue transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} CareerAI Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors text-text-secondary text-xs font-bold">in</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors text-text-secondary text-xs font-bold">tw</div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors text-text-secondary text-xs font-bold">fb</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
