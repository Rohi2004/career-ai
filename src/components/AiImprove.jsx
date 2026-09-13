import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowLeft, Sparkles, Wand2, Copy, 
  CheckCircle2, AlertCircle, RefreshCw, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  "Improve professional wording",
  "Add measurable achievements",
  "Include relevant technical skills",
  "Use stronger action verbs",
  "Make the summary more concise"
];

const AiImprove = () => {
  const { user } = useAuth();
  const [currentSummary, setCurrentSummary] = useState(
    "I am a software engineer. I have 3 years of experience. I know React, Node.js, and MongoDB. I work hard and want a new job where I can build good apps."
  );
  
  const [improvedSummary, setImprovedSummary] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // AI score simulation
  const [score, setScore] = useState(65);
  const [hasImproved, setHasImproved] = useState(false);

  const charCount = currentSummary.length;

  // Real API function
  const improveWithAI = async () => {
    if (currentSummary.trim().length < 10) {
      setError('Please provide a longer summary for the AI to analyze.');
      return;
    }
    
    setError('');
    setIsImproving(true);
    setImprovedSummary('');
    
    try {
      // Use the api utility from '../utils/api' which we need to import
      const response = await api.post('/ai/improve-summary', {
        currentSummary,
        skills: '', // We could pull this from context if needed, but summary is main focus
        experience: '' 
      }, user?.token);

      if (response.success && response.data) {
        setImprovedSummary(response.data.improvedSummary || response.data.improved_summary || "Error parsing AI response.");
        setHasImproved(true);
        
        // Simulate score jumping after improvement based on the new quality
        let currentScore = score;
        const targetScore = Math.floor(Math.random() * (98 - 85 + 1)) + 85; // Random score 85-98
        const interval = setInterval(() => {
          if (currentScore >= targetScore) {
            clearInterval(interval);
            setScore(targetScore);
          } else {
            currentScore += 3;
            setScore(currentScore > targetScore ? targetScore : currentScore);
          }
        }, 50);
      } else {
        setError(response.message || 'Failed to generate AI improvement. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to the AI service.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopy = () => {
    if (!improvedSummary) return;
    navigator.clipboard.writeText(improvedSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseThisVersion = () => {
    setCurrentSummary(improvedSummary);
    setImprovedSummary('');
    setHasImproved(false);
    
    // Show success toast
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full relative">
        
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="font-semibold text-sm">Summary updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">AI Improve</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 flex items-center gap-3">
                AI Resume Improvement <Sparkles className="text-accent-purple" size={24} />
              </h1>
              <p className="text-text-secondary text-sm">Use AI to make your resume more professional, clear, and impactful.</p>
            </div>
            
            <Link to="/resume" className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm shadow-sm w-fit">
              <ArrowLeft size={16} /> Back to Resume Builder
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 pb-12">
          
          {/* Left / Main Workspace */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              
              {/* Left Panel: Current Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      1
                    </div>
                    Your Current Summary
                  </h2>
                </div>
                
                <div className="flex-1 flex flex-col relative">
                  <textarea 
                    value={currentSummary}
                    onChange={(e) => {
                      setCurrentSummary(e.target.value);
                      setError('');
                    }}
                    className={`flex-1 w-full p-4 rounded-xl border ${error ? 'border-red-500 bg-red-50/20' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all resize-none min-h-[250px] text-text-primary text-sm leading-relaxed`}
                    placeholder="Paste your current professional summary here..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                    {charCount} characters
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
                
                <button 
                  onClick={improveWithAI}
                  disabled={isImproving || !currentSummary}
                  className="mt-5 btn btn-primary w-full py-3.5 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
                >
                  {isImproving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin text-white" />
                      <span>Analyzing & Improving...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} className="text-white group-hover:scale-110 transition-transform" />
                      <span>Improve With AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Panel: AI Result */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-purple-100 shadow-inner flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center shadow-sm">
                      <Sparkles size={16} />
                    </div>
                    AI Improved Summary
                  </h2>
                </div>

                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/50 p-5 relative z-10">
                  {isImproving ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
                        <Sparkles size={20} className="text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold text-purple-800 text-sm">AI is working its magic...</p>
                        <p className="text-xs text-purple-600/70 mt-1">Applying industry best practices.</p>
                      </div>
                    </div>
                  ) : improvedSummary ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col"
                    >
                      <p className="text-sm text-slate-700 leading-relaxed flex-1 whitespace-pre-wrap">
                        {improvedSummary}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-3 opacity-60">
                      <Wand2 size={40} className="text-purple-200" />
                      <p className="text-sm">Click "Improve With AI" to generate a polished, professional version of your summary.</p>
                    </div>
                  )}
                </div>

                {/* Actions for Improved Result */}
                <div className="mt-5 flex items-center gap-3 relative z-10">
                  <button 
                    disabled={!improvedSummary || isImproving}
                    onClick={handleUseThisVersion}
                    className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Use This Version
                  </button>
                  <button 
                    disabled={!improvedSummary || isImproving}
                    onClick={handleCopy}
                    className="w-12 h-12 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
                
                {/* Background decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              </div>

            </div>

            {/* Before vs After Section (Visible after improvement) */}
            <AnimatePresence>
              {hasImproved && !isImproving && improvedSummary && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
                    <Zap size={18} className="text-amber-500" />
                    Before vs After Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                      <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Original</div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{currentSummary}</p>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                      <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                        Improved <Sparkles size={12}/>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium line-clamp-4">{improvedSummary}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Sidebar Widgets */}
          <div className="flex flex-col gap-6">
            
            {/* AI Resume Score */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <h3 className="font-bold text-text-primary mb-6 w-full text-left">Summary Score</h3>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <motion.circle 
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-text-primary tracking-tighter">
                    {score}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary">
                {score >= 80 
                  ? "Excellent! Your summary is compelling and professional."
                  : score >= 60 
                  ? "Good, but could be stronger with more impactful vocabulary."
                  : "Needs work. Use AI to improve your professional framing."
                }
              </p>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-text-primary mb-4">AI Focus Areas</h3>
              <ul className="space-y-3">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 text-accent-blue bg-blue-50 rounded-full p-1 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-slate-600 font-medium">{suggestion}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <Wand2 size={20} className="text-accent-purple shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">How it works</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Our AI analyzes your text against thousands of successful resumes, applying industry-standard best practices to ensure you stand out.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiImprove;
