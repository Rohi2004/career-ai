import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, MapPin, Briefcase, FileText, 
  CheckCircle2, ArrowLeft, Send, AlertCircle, Pencil, Loader2
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [coverMessage, setCoverMessage] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
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

    if (user?.token) {
      fetchJob();
    }
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!confirmationChecked) {
      setError('You must confirm that your information is correct before submitting.');
      return;
    }

    if (hasApplied) {
      setError('You have already applied for this position.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/applications', {
        jobId: job._id,
        coverLetter: coverMessage
      }, user?.token);

      if (response.success) {
        setApplicationId(response.data._id);
        setHasApplied(true);
      } else {
        setError(response.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-10 h-10 animate-spin text-accent-blue" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Job Not Found</h2>
          <p className="text-text-secondary mb-6">{error || "The job you're looking for doesn't exist."}</p>
          <button onClick={() => navigate('/jobs')} className="btn btn-primary px-6 py-2">Back to Jobs</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <Link to="/jobs" className="hover:text-accent-blue transition-colors">Jobs</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <Link to={`/jobs/${id}`} className="hover:text-accent-blue transition-colors truncate max-w-[150px]">{job.title}</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">Apply</span>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto w-full pb-12">
          
          <button 
            onClick={() => navigate(`/jobs/${id}`)} 
            className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm font-medium transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Job Details
          </button>

          <AnimatePresence mode="wait">
            {hasApplied ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={50} />
                </div>
                <h1 className="text-3xl font-extrabold text-text-primary mb-2">Application Successful!</h1>
                <p className="text-lg text-text-secondary mb-8 max-w-lg">
                  You have successfully applied for the <span className="font-bold text-text-primary">{job.title}</span> position at <span className="font-bold text-text-primary">{job.company}</span>.
                </p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 mb-10 flex items-center gap-4">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Application ID:</div>
                  <div className="text-lg font-mono font-bold text-text-primary">{applicationId}</div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => navigate('/jobs')} className="btn btn-secondary px-6 py-3 font-semibold">
                    Browse More Jobs
                  </button>
                  <button onClick={() => navigate('/applications')} className="btn btn-primary px-8 py-3 font-semibold shadow-sm">
                    Track Application
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm"
              >
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h1 className="text-2xl font-bold text-text-primary mb-2">Submit Your Application</h1>
                  <p className="text-text-secondary">Review your details and submit your application for this role.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* 1. Job Summary */}
                  <section>
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-accent-blue flex items-center justify-center text-xs">1</div>
                      Role Summary
                    </h2>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{job.title}</h3>
                        <p className="text-sm font-semibold text-accent-blue">{job.company}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</div>
                        <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> {job.type || 'Full-time'}</div>
                      </div>
                    </div>
                  </section>

                  {/* 2. Candidate Info */}
                  <section>
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-accent-blue flex items-center justify-center text-xs">2</div>
                      Your Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <div className="font-semibold text-text-primary">{user?.name}</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                        <div className="font-semibold text-text-primary">{user?.email}</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                        <div className="font-semibold text-text-primary capitalize">{user?.role}</div>
                      </div>
                    </div>
                    <p className="text-xs text-text-light mt-3">To update your contact information, please edit your <Link to="/profile" className="text-accent-blue hover:underline">Profile Settings</Link>.</p>
                  </section>

                  {/* 3. Resume Section */}
                  <section>
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-accent-blue flex items-center justify-center text-xs">3</div>
                      Attached Resume
                    </h2>
                    <div className="border-2 border-accent-blue bg-blue-50/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-12 h-12 bg-accent-blue text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-text-primary">CareerAI Profile Resume</h3>
                        <p className="text-xs text-text-secondary mt-0.5">Used for this application</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button type="button" onClick={() => navigate('/resume/preview')} className="flex-1 sm:flex-none btn btn-secondary px-4 py-2 text-sm bg-white hover:bg-slate-50">
                          Preview
                        </button>
                        <button type="button" onClick={() => navigate('/resume')} className="flex-1 sm:flex-none btn btn-secondary px-4 py-2 text-sm flex items-center justify-center gap-2 bg-white hover:bg-slate-50">
                          <Pencil size={14} /> Edit
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* 4. Cover Message */}
                  <section>
                    <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-accent-blue flex items-center justify-center text-xs">4</div>
                      Cover Message <span className="text-sm font-normal text-slate-400 ml-1">(Optional)</span>
                    </h2>
                    <textarea 
                      value={coverMessage}
                      onChange={(e) => setCoverMessage(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all min-h-[160px] resize-y text-text-primary placeholder:text-slate-400"
                      placeholder="Write a brief message highlighting why you are a great fit for this specific role..."
                    />
                  </section>

                  {/* Error State */}
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 flex items-center gap-3 font-medium text-sm">
                      <AlertCircle size={18} /> {error}
                    </div>
                  )}

                  {/* 5. Confirmation & Submission */}
                  <section className="border-t border-slate-200 pt-8 mt-8">
                    <label className="flex items-start gap-3 cursor-pointer group mb-8">
                      <input 
                        type="checkbox" 
                        checked={confirmationChecked}
                        onChange={(e) => setConfirmationChecked(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">
                        I confirm that the information provided in this application is true and correct to the best of my knowledge. I understand that any false statements may disqualify me from employment.
                      </span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                      <button 
                        type="button" 
                        onClick={() => navigate(`/jobs/${id}`)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-text-secondary hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto btn btn-primary px-10 py-3.5 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>Submit Application <Send size={18} /></>
                        )}
                      </button>
                    </div>
                  </section>

                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyJob;
