import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, MapPin, Briefcase, Clock, DollarSign, 
  Sparkles, BookmarkPlus, ArrowUpRight, ArrowLeft,
  CheckCircle2, AlertCircle, X, Send, FileText, Zap, Loader2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RELATED_JOBS = [
  { id: 2, title: 'Full Stack Software Engineer', company: 'CloudScale', location: 'New York, NY', salary: '$120k - $160k', type: 'Full-time' },
  { id: 3, title: 'React Native Developer', company: 'MobileInnovate', location: 'Remote', salary: '$110k - $140k', type: 'Full-time' },
  { id: 4, title: 'Frontend Technical Lead', company: 'BuildOps', location: 'Austin, TX', salary: '$150k - $190k', type: 'Hybrid' }
];

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJobDetails();
    // Scroll to top when loading new job
    window.scrollTo(0, 0);
  }, [id, user]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/jobs/${id}`, user?.token);
      if (response.success && response.data) {
        setJob(response.data);
      } else {
        setError(response.message || 'Failed to load job details.');
      }
    } catch (err) {
      setError('An error occurred while fetching job details.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/applications', {
        jobId: job._id,
        coverLetter
      }, user?.token);
      
      if (response.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setApplySuccess(false);
          setCoverLetter('');
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Error Loading Job</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/jobs')} className="btn btn-secondary px-6 py-2">Back to Jobs</button>
            <button onClick={fetchJobDetails} className="btn btn-primary px-6 py-2">Try Again</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || !job) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <Link to="/jobs" className="hover:text-accent-blue transition-colors">Jobs</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">Job Details</span>
          </nav>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/jobs')} className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm font-medium transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <ArrowLeft size={16} /> Back to Search
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 pb-12">
          
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            
            {/* Job Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                
                {/* Logo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl font-bold text-slate-600 shrink-0 border border-slate-200/50 shadow-inner z-10">
                  {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                </div>
                
                {/* Title & Info */}
                <div className="flex-1 z-10">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-2 pr-12">{job.title}</h1>
                  <p className="text-lg font-semibold text-accent-blue mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600 mb-6">
                    <div className="flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> {job.location}</div>
                    <div className="flex items-center gap-2"><Briefcase size={18} className="text-slate-400" /> {job.type || 'Full-time'}</div>
                    <div className="flex items-center gap-2"><Clock size={18} className="text-slate-400" /> {job.experienceLevel || 'Mid Level'}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-slate-400" /> {job.salaryRange || 'Competitive'}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full sm:w-auto btn btn-primary px-8 py-3 flex items-center justify-center gap-2 text-base shadow-sm"
                    >
                      Apply Now <ArrowUpRight size={18} />
                    </button>
                    <button 
                      onClick={() => setIsSaved(!isSaved)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                        isSaved 
                          ? 'bg-blue-50 border-blue-200 text-accent-blue' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isSaved ? <><CheckCircle2 size={18} /> Saved</> : <><BookmarkPlus size={18} /> Save Job</>}
                    </button>
                  </div>
                  <p className="text-xs text-text-light mt-4">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Main Content Body */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 text-text-primary text-sm sm:text-base leading-relaxed">
              
              <section>
                <h3 className="text-lg font-bold mb-3">Job Description</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
              </section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                <section>
                  <h3 className="text-lg font-bold mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(job.requirements || []).map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
            
            {/* AI Match Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-bold text-purple-900 mb-6 flex items-center gap-2 relative z-10">
                <Sparkles size={20} className="text-purple-600" /> AI Resume Match
              </h3>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-200/50" />
                    <motion.circle 
                      cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray="282.7"
                      initial={{ strokeDashoffset: 282.7 }}
                      animate={{ strokeDashoffset: 282.7 - (282.7 * (job.matchScore || 85)) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-green-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-purple-900">{job.matchScore || 85}%</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-purple-900 text-lg">Good Match</p>
                  <p className="text-xs text-purple-700/70 font-medium mt-1">Based on your main resume.</p>
                </div>
              </div>

              <button onClick={() => alert('AI Match Detailed Analysis coming soon!')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors shadow-sm relative z-10">
                See Detailed AI Analysis
              </button>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Related Jobs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-text-primary mb-4 border-b border-slate-100 pb-2">Related Jobs</h3>
              <div className="flex flex-col gap-4">
                {RELATED_JOBS.map(related => (
                  <Link to={`/jobs/${related.id}`} key={related.id} className="group flex flex-col gap-1 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm text-text-primary group-hover:text-accent-blue transition-colors truncate">{related.title}</h4>
                    <p className="text-xs text-text-secondary font-medium">{related.company}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {related.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12}/> {related.salary}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Apply Job Modal */}
        <AnimatePresence>
          {isApplyModalOpen && (
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
                        <CheckCircle2 size={40} />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">Application Submitted!</h2>
                      <p className="text-text-secondary">
                        Your application for <span className="font-semibold text-text-primary">{job.title}</span> at <span className="font-semibold text-text-primary">{job.company}</span> has been sent successfully.
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
                        <h2 className="text-xl font-bold text-text-primary pr-10">Apply for {job.title}</h2>
                        <p className="text-sm font-semibold text-accent-blue">{job.company} <span className="text-text-light font-normal">• {job.location}</span></p>
                      </div>
                      
                      <form onSubmit={submitApplication} className="p-6 flex flex-col gap-5">
                        
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
                            <CheckCircle2 size={20} className="text-accent-blue" />
                          </div>
                        </div>

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

export default JobDetails;
