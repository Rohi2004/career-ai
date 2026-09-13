import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, MapPin, Briefcase, 
  Clock, DollarSign, Sparkles, Filter, 
  SlidersHorizontal, BookmarkPlus, ArrowUpRight, 
  X, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { Send, FileText, CheckCircle2 as CheckCircleSolid } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    location: ''
  });

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // Fetch jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/jobs', user?.token);
      if (response.success) {
        setJobs(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError('An error occurred while fetching jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Since we don't have a specific search endpoint yet, we could filter client-side 
    // or we can implement search in the backend. 
    // For now, let's just fetch all and filter client side for simplicity.
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ jobType: '', experience: '', location: '' });
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setApplySuccess(false);
    setCoverLetter('');
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/applications', {
        jobId: selectedJob._id,
        coverLetter
      }, user?.token);
      
      if (response.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setSelectedJob(null);
        }, 2000);
      } else {
        alert(response.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while applying.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client side filtering
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filters.jobType || job.type === filters.jobType;
    const matchesExp = !filters.experience || job.experienceLevel === filters.experience;
    const matchesLoc = !filters.location || job.locationType === filters.location; // assuming locationType

    return matchesSearch && matchesType && matchesExp && matchesLoc;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">Jobs</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Find Your Next Opportunity</h1>
              <p className="text-text-secondary text-sm">Discover jobs that match your skills and career goals.</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 pb-12">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-center gap-2 font-semibold text-text-primary shadow-sm"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>

          {/* Left Sidebar: Filters */}
          <div className={`lg:w-64 xl:w-72 shrink-0 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h2>
                <button onClick={clearFilters} className="text-xs font-semibold text-accent-blue hover:text-blue-700 transition-colors">
                  Clear All
                </button>
              </div>

              {/* Filter Group: Job Type */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-text-primary mb-3">Job Type</h3>
                <div className="flex flex-col gap-2.5">
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filters.jobType === type}
                        onChange={() => setFilters({...filters, jobType: filters.jobType === type ? '' : type})}
                        className="w-4 h-4 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-text-primary mb-3">Experience Level</h3>
                <div className="flex flex-col gap-2.5">
                  {['Entry Level', 'Mid Level', 'Senior Level', 'Director'].map(level => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filters.experience === level}
                        onChange={() => setFilters({...filters, experience: filters.experience === level ? '' : level})}
                        className="w-4 h-4 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Location */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Location</h3>
                <div className="flex flex-col gap-2.5">
                  {['Remote', 'On-site', 'Hybrid'].map(loc => (
                    <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filters.location === loc}
                        onChange={() => setFilters({...filters, location: filters.location === loc ? '' : loc})}
                        className="w-4 h-4 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer"
                      />
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
              
            </div>
          </div>

          {/* Right Column: Search & Results */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <div className="flex-1 flex items-center px-3">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company..."
                  className="w-full px-3 py-2 bg-transparent border-none focus:outline-none text-text-primary text-sm sm:text-base placeholder:text-slate-400"
                />
              </div>
            </form>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Recommended Jobs</h2>
                <p className="text-sm text-text-secondary">Showing {filteredJobs.length} opportunities</p>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary">Sort by:</label>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-accent-blue transition-colors outline-none cursor-pointer">
                  <option>Newest Posted</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            {/* Content State: Error, Loading, Empty, or List */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                <AlertCircle size={40} className="text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h3>
                <p className="text-text-secondary mb-6">{error}</p>
                <button onClick={fetchJobs} className="btn btn-secondary px-6 py-2">Try Again</button>
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col sm:flex-row gap-6">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">No jobs found</h3>
                <p className="text-text-secondary mb-6 max-w-md">We couldn't find any jobs matching your current search criteria. Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn btn-primary px-6 py-2.5">Clear Filters</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredJobs.map((job) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={job._id} 
                    className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col sm:flex-row gap-5"
                  >
                    
                    {/* Company Logo */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 shrink-0">
                      {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                        <div>
                          <Link to={`/jobs/${job._id}`} className="text-lg font-bold text-text-primary truncate group-hover:text-accent-blue transition-colors cursor-pointer block">
                            {job.title}
                          </Link>
                          <div className="text-sm font-semibold text-text-secondary mt-0.5">
                            {job.company}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs md:text-sm text-text-secondary">
                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</div>
                        <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> {job.type || 'Full-time'}</div>
                        <div className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {job.experienceLevel || 'Mid Level'}</div>
                        <div className="flex items-center gap-1.5 font-medium text-text-primary"><DollarSign size={16} className="text-slate-400" /> {job.salaryRange || 'Competitive'}</div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(job.requirements || []).slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <p className="text-xs text-text-light font-medium sm:hidden">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-accent-blue flex items-center justify-center transition-colors shadow-sm">
                          <BookmarkPlus size={18} />
                        </button>
                        <button 
                          onClick={() => handleApplyClick(job)}
                          className="btn btn-primary px-4 py-2 text-sm flex-1 sm:flex-none flex items-center justify-center gap-2 shadow-sm"
                        >
                          Apply <ArrowUpRight size={16} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-text-light font-medium hidden sm:block mt-2">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                  </motion.div>
                ))}
              </div>
            )}
            
          </div>
        </div>
        
        {/* Apply Job Modal */}
        <AnimatePresence>
          {isApplyModalOpen && selectedJob && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                onClick={() => !isSubmitting && !applySuccess && setIsApplyModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg flex flex-col pointer-events-auto overflow-hidden">
                  
                  {applySuccess ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
                      >
                        <CheckCircleSolid size={40} />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">Application Submitted!</h2>
                      <p className="text-text-secondary">
                        Your application for <span className="font-semibold text-text-primary">{selectedJob.title}</span> at <span className="font-semibold text-text-primary">{selectedJob.company}</span> has been sent successfully.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="px-6 py-5 border-b border-slate-200 flex flex-col gap-1 shrink-0 bg-slate-50 relative">
                        <button 
                          onClick={() => setIsApplyModalOpen(false)} 
                          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm"
                        >
                          <X size={18} />
                        </button>
                        <h2 className="text-xl font-bold text-text-primary pr-10">Apply for {selectedJob.title}</h2>
                        <p className="text-sm font-semibold text-accent-blue">{selectedJob.company} <span className="text-text-light font-normal">• {selectedJob.location}</span></p>
                      </div>
                      
                      <form onSubmit={submitApplication} className="p-6 flex flex-col gap-5">
                        
                        {/* Resume Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Resume</label>
                          <div className="flex items-center gap-3 p-3 border border-accent-blue bg-blue-50/50 rounded-xl cursor-pointer">
                            <div className="w-10 h-10 bg-accent-blue text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-text-primary">CareerAI Profile Resume</p>
                              <p className="text-xs text-text-secondary">Used for this application</p>
                            </div>
                            <CheckCircleSolid size={20} className="text-accent-blue" />
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Cover Letter (Optional)</label>
                          <textarea 
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all h-32 resize-y text-sm text-text-primary placeholder:text-slate-400"
                            placeholder="Write a brief message to the hiring manager..." 
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-2">
                          <button 
                            type="button" 
                            onClick={() => setIsApplyModalOpen(false)} 
                            className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
                          >
                            {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>Submit Application <Send size={16} /></>
                            )}
                          </button>
                        </div>

                      </form>
                    </>
                  )}
                  
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default Jobs;
