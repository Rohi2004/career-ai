import React, { useState } from 'react';
import { 
  LayoutDashboard, Briefcase, PlusCircle, CheckSquare, 
  Users, LogOut, Menu, X, Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Job Listings', path: '#', icon: <Briefcase size={20} /> },
    { name: 'Add Job', path: '/admin/jobs/new', icon: <PlusCircle size={20} /> },
    { name: 'Applications', path: '#', icon: <CheckSquare size={20} /> },
    { name: 'Users', path: '#', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-text-primary">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
            <Link to="/" className="text-xl font-extrabold flex items-center gap-2 text-text-primary">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              CareerAI <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md ml-1">ADMIN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  location.pathname === item.path || (location.pathname.startsWith('/admin') && item.path === '/admin')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-slate-100">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              Logout
            </Link>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg lg:hidden transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-text-primary hidden sm:block">Admin Center</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
