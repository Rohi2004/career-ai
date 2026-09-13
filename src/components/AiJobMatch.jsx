import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Sparkles, CheckCircle2, Zap, 
  ArrowLeft, ArrowUpRight, BarChart3, AlertCircle,
  X, Send, FileText, Wrench
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AiJobMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchAnalysis();
    }
    window.scrollTo(0, 0);
  }, [id, user]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Fetch Resume
      const resumeRes = await api.get('/resumes/me', user.token);
      if (!resumeRes.success) {
        throw new Error('Failed to load your resume. Make sure you have created one.');
      }
      const resume = resumeRes.data;

      // 2. Fetch Job
      const jobRes = await api.get(`/jobs/${id}`, user.token);
      if (!jobRes.success) {
        throw new Error('Failed to load job details.');
      }
      const job = jobRes.data;

      // 3. Get AI Match
      const matchRes = await api.post('/ai/job-match', {
        resumeData: JSON.stringify(resume),
        jobDescription: job.description,
        requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : ''
      }, user.token);

      if (!matchRes.success) {
        throw new Error(matchRes.message || 'Failed to analyze match.');
      }

      // Add job title and company from the job object since AI might not return it
      const matchData = matchRes.data;
      matchData.jobTitle = job.title;
      matchData.company = job.company;

      setData(matchData);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitApplication = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        setCoverLetter('');
      }, 2000);
    }, 1500);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Analysis Failed</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/jobs/${id}`)} className="btn btn-secondary px-6 py-2">Back to Job</button>
            <button onClick={fetchAnalysis} className="btn btn-primary px-6 py-2">Try Again</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
            <Sparkles size={32} className="text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Analyzing Match...</h2>
            <p className="text-purple-600/80 max-w-sm mx-auto">Our AI is comparing your resume against the job requirements for this role to give you actionable insights.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

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
            <Link to={`/jobs/${id}`} className="hover:text-accent-blue transition-colors truncate max-w-[100px] sm:max-w-none">{data.jobTitle}</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">AI Match</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 flex items-center gap-3">
                AI Job Match Analysis <Sparkles className="text-accent-purple" size={24} />
              </h1>
              <p className="text-text-secondary text-sm">See how well your resume matches this job and what you can improve.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/jobs/${id}`)} className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm shadow-sm">
                <ArrowLeft size={16} /> Back to Job
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 pb-12">
          
          {/* Top Row: Overall Score & Match Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Match Score */}
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-purple-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <h2 className="text-lg font-bold text-purple-900 mb-6 relative z-10">Overall Match Score</h2>
              
              <div className="relative w-40 h-40 flex items-center justify-center mb-6 relative z-10">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-200/50" />
                  <motion.circle 
                    cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="282.7"
                    initial={{ strokeDashoffset: 282.7 }}
                    animate={{ strokeDashoffset: 282.7 - (282.7 * data.overallScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={data.overallScore >= 80 ? 'text-green-500' : data.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-purple-900">{data.overallScore}%</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                  <Sparkles size={16} /> {data.label}
                </div>
                <p className="text-sm text-purple-800 leading-relaxed font-medium">
                  {data.explanation}
                </p>
              </div>

              {/* Decorative Background */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            {/* Match Breakdown & Action Buttons */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex-1">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-accent-blue" /> Match Breakdown
                </h2>
                
                <div className="flex flex-col gap-5">
                  {data.breakdown.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">{item.category}</span>
                        <span className={`text-sm font-bold ${item.score >= 80 ? 'text-green-500' : item.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                          className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Actions */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => navigate('/resume')} className="w-full sm:flex-1 btn btn-secondary py-3.5 flex items-center justify-center gap-2 font-semibold">
                  <Wrench size={18} /> Improve My Resume
                </button>
                <button onClick={() => navigate(`/jobs/${id}/apply`)} className="w-full sm:flex-1 btn btn-primary py-3.5 flex items-center justify-center gap-2 font-semibold shadow-sm">
                  Apply Now <ArrowUpRight size={18} />
                </button>
              </div>

            </div>

          </div>

          {/* AI Recommendation & Improve Match */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-accent-purple" /> AI Recommendation
              </h2>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex-1">
                <p className="text-purple-900 leading-relaxed font-medium">
                  {data.recommendation}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                <Wrench size={20} className="text-slate-600" /> Improve Your Match
              </h2>
              <div className="space-y-4">
                {data.improvementSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-accent-blue flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-100">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">{step.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Two Column Skills Comparison */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-8 text-center border-b border-slate-100 pb-4">Skills Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Left Column: Your Skills */}
              <div>
                <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-center bg-slate-50 py-2 rounded-lg border border-slate-200">
                  Your Skills
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.skillsAnalysis.matching.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
                      <Sparkles size={14} /> Additional Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.skillsAnalysis.additional.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Job Requirements */}
              <div>
                <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-center bg-slate-50 py-2 rounded-lg border border-slate-200">
                  Job Requirements
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.skillsAnalysis.matching.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
                      <Zap size={14} /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.skillsAnalysis.missing.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
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
                        Your application for <span className="font-semibold text-text-primary">{data.jobTitle}</span> at <span className="font-semibold text-text-primary">{data.company}</span> has been sent successfully.
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
                        <h2 className="text-xl font-bold text-text-primary pr-10">Apply for {data.jobTitle}</h2>
                        <p className="text-sm font-semibold text-accent-blue">{data.company}</p>
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
                              <p className="text-xs text-text-secondary">Updated 2 days ago</p>
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

export default AiJobMatch;
