import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Briefcase, Building, MapPin, 
  Calendar, Sparkles, ArrowRight, CheckCircle2, 
  Circle, AlertCircle, RefreshCw, Layers, SortDesc, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  'Applied': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Shortlisted': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'Interview': { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'Selected': { color: 'bg-green-100 text-green-700 border-green-200' },
  'Rejected': { color: 'bg-red-100 text-red-700 border-red-200' },
  'Pending': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Reviewed': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'Accepted': { color: 'bg-green-100 text-green-700 border-green-200' }
};

// Fallback logic for status mapping since backend uses ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected']
const getMappedStatus = (rawStatus) => {
  const map = {
    'Pending': 'Applied',
    'Reviewed': 'Shortlisted',
    'Interview': 'Interview',
    'Accepted': 'Selected',
    'Rejected': 'Rejected'
  };
  return map[rawStatus] || rawStatus;
};

const getTimeline = (status, date) => {
  const mappedStatus = getMappedStatus(status);
  
  const baseTimeline = [
    { step: 'Applied', completed: false, current: false, date: '' },
    { step: 'Shortlisted', completed: false, current: false, date: '' },
    { step: 'Interview', completed: false, current: false, date: '' },
    { step: 'Selected', completed: false, current: false, date: '' }
  ];

  const dateStr = new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  
  if (mappedStatus === 'Applied') {
    baseTimeline[0] = { ...baseTimeline[0], completed: true, current: true, date: dateStr };
  } else if (mappedStatus === 'Shortlisted') {
    baseTimeline[0] = { ...baseTimeline[0], completed: true, date: dateStr };
    baseTimeline[1] = { ...baseTimeline[1], completed: true, current: true, date: 'Pending' };
  } else if (mappedStatus === 'Interview') {
    baseTimeline[0] = { ...baseTimeline[0], completed: true, date: dateStr };
    baseTimeline[1] = { ...baseTimeline[1], completed: true, date: 'Done' };
    baseTimeline[2] = { ...baseTimeline[2], completed: true, current: true, date: 'Pending' };
  } else if (mappedStatus === 'Selected') {
    baseTimeline[0] = { ...baseTimeline[0], completed: true, date: dateStr };
    baseTimeline[1] = { ...baseTimeline[1], completed: true, date: 'Done' };
    baseTimeline[2] = { ...baseTimeline[2], completed: true, date: 'Done' };
    baseTimeline[3] = { ...baseTimeline[3], completed: true, current: true, date: 'Done' };
  } else if (mappedStatus === 'Rejected') {
    baseTimeline[0] = { ...baseTimeline[0], completed: true, date: dateStr };
    // Just mark applied as done, rest incomplete
  }

  return baseTimeline;
};

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const fetchApplications = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.get('/applications/me', user?.token);
      if (response.success) {
        // Format the raw data to match UI expectations
        const formattedApps = (response.data || []).map(app => {
          const mappedStatus = getMappedStatus(app.status);
          const job = app.jobId || {};
          
          return {
            id: app._id,
            jobId: job._id,
            jobTitle: job.title || 'Unknown Job',
            company: job.company || 'Unknown Company',
            companyLogo: job.company ? job.company.charAt(0).toUpperCase() : 'C',
            location: job.location || 'Unknown Location',
            appliedDate: new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            status: mappedStatus,
            rawStatus: app.status,
            matchScore: 85, // MOCK score
            timeline: getTimeline(app.status, app.appliedAt || app.createdAt),
            createdAt: new Date(app.createdAt)
          };
        });
        setApplications(formattedApps);
      } else {
        setError(response.message || 'Failed to fetch applications.');
      }
    } catch (err) {
      setError('An error occurred while fetching your applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchApplications();
    }
  }, [user]);

  const getFilteredApps = () => {
    let filtered = applications;
    
    // Apply Status Filter
    if (filter !== 'All') {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    // Apply Sorting 
    filtered.sort((a, b) => {
      if (sortBy === 'Newest') {
        return b.createdAt - a.createdAt;
      } else {
        return a.createdAt - b.createdAt;
      }
    });
    
    return filtered;
  };

  const filteredApps = getFilteredApps();

  // Summary Metrics
  const summary = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied' || a.status === 'Shortlisted').length,
    interviews: applications.filter(a => a.status === 'Interview').length,
    offers: applications.filter(a => a.status === 'Selected').length
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative pb-12">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">Applications</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">My Applications</h1>
              <p className="text-text-secondary text-sm">Track the progress of all your job applications.</p>
            </div>
            
            <Link to="/jobs" className="btn btn-primary px-5 py-2.5 flex items-center justify-center gap-2 text-sm shadow-sm w-full sm:w-auto">
              <Briefcase size={16} /> Explore Jobs
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-text-secondary mb-1">Total Applications</span>
            <span className="text-3xl font-extrabold text-text-primary">{summary.total}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-text-secondary mb-1">Active</span>
            <span className="text-3xl font-extrabold text-blue-600">{summary.applied}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-text-secondary mb-1">Interviews</span>
            <span className="text-3xl font-extrabold text-amber-500">{summary.interviews}</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-semibold text-text-secondary mb-1">Offers</span>
            <span className="text-3xl font-extrabold text-green-500">{summary.offers}</span>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === tab 
                    ? 'bg-accent-blue text-white shadow-sm' 
                    : 'bg-white text-text-secondary hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shrink-0">
            <SortDesc size={16} className="text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-text-primary"
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {/* Content States */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <AlertCircle size={40} className="text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h3>
            <p className="text-text-secondary mb-6">{error}</p>
            <button onClick={fetchApplications} className="btn btn-secondary px-6 py-2 flex items-center gap-2">
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-10 h-10 animate-spin text-accent-blue" />
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <Layers size={40} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Applications Yet</h3>
            <p className="text-text-secondary mb-8 max-w-md">Your applications will appear here after you apply to a job. Start exploring open positions!</p>
            <Link to="/jobs" className="btn btn-primary px-8 py-3">Find Jobs</Link>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-10 text-center">
            <p className="text-text-secondary font-medium">No applications found with the status "{filter}".</p>
            <button onClick={() => setFilter('All')} className="text-accent-blue font-bold mt-2 hover:underline">Clear filter</button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <AnimatePresence>
              {filteredApps.map((app) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  key={app.id} 
                  className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
                >
                  
                  {/* Top Details */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 shrink-0 border border-slate-200/50">
                        {app.companyLogo}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">{app.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                          <span className="flex items-center gap-1.5"><Building size={14}/> {app.company}</span>
                          <span className="hidden md:inline text-slate-300">•</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14}/> {app.location}</span>
                          <span className="hidden md:inline text-slate-300">•</span>
                          <span className="flex items-center gap-1.5"><Calendar size={14}/> Applied: {app.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 pl-16 md:pl-0">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${STATUS_CONFIG[app.status]?.color || STATUS_CONFIG['Applied'].color}`}>
                        {app.status}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-bold">
                        <Sparkles size={12} /> {app.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="bg-slate-50 rounded-2xl p-5 md:px-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative">
                    
                    {/* Visual Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -translate-y-1/2 z-0">
                      <div className="h-full bg-accent-blue transition-all" style={{ 
                        width: app.status === 'Applied' || app.status === 'Rejected' ? '0%' : 
                               app.status === 'Shortlisted' ? '33%' : 
                               app.status === 'Interview' ? '66%' : '100%' 
                      }}></div>
                    </div>

                    {/* Timeline Steps */}
                    {app.timeline.map((item, idx) => (
                      <div key={idx} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 w-full md:w-auto relative">
                        
                        {/* Mobile Connector Line */}
                        {idx !== app.timeline.length - 1 && (
                          <div className="md:hidden absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-slate-200 z-0">
                            {item.completed && app.timeline[idx+1]?.completed && (
                              <div className="h-full w-full bg-accent-blue"></div>
                            )}
                          </div>
                        )}

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 ${
                          app.status === 'Rejected' && item.step !== 'Applied'
                            ? 'bg-slate-200 text-slate-400'
                            : item.current
                            ? 'bg-accent-blue text-white ring-4 ring-blue-100'
                            : item.completed
                            ? 'bg-accent-blue text-white'
                            : 'bg-white border-2 border-slate-200 text-slate-300'
                        }`}>
                          {item.completed ? <CheckCircle2 size={14} strokeWidth={3} /> : <Circle size={10} fill="currentColor" />}
                        </div>
                        
                        <div className="flex flex-col md:items-center">
                          <span className={`text-sm font-bold ${
                             app.status === 'Rejected' && item.step !== 'Applied' 
                              ? 'text-slate-400'
                              : item.current || item.completed 
                              ? 'text-text-primary' 
                              : 'text-slate-400'
                          }`}>
                            {item.step}
                          </span>
                          {item.date && (
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.date}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Rejection State override */}
                    {app.status === 'Rejected' && (
                      <div className="absolute top-1/2 right-10 -translate-y-1/2 z-20 hidden md:flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-sm">
                        <AlertCircle size={14} /> Application closed
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end">
                    <Link to={`/jobs/${app.jobId}`} className="text-sm font-semibold text-accent-blue hover:text-blue-700 flex items-center gap-1 transition-colors">
                      View Job Details <ArrowRight size={16} />
                    </Link>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Applications;
