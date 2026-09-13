import React, { useState, useEffect } from 'react';
import { 
  FileText, Sparkles, Briefcase, 
  CheckSquare, ArrowRight, ChevronRight, Clock, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

// Mock Data
const recentApplications = [
  { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp Inc.', date: 'Oct 12, 2026', status: 'Interview' },
  { id: 2, title: 'React Engineer', company: 'StartupX', date: 'Oct 10, 2026', status: 'Applied' },
  { id: 3, title: 'UI/UX Developer', company: 'DesignStudio', date: 'Oct 05, 2026', status: 'Shortlisted' },
  { id: 4, title: 'Fullstack Developer', company: 'Legacy Systems', date: 'Sep 28, 2026', status: 'Rejected' },
];

const recommendedJobs = [
  { id: 1, title: 'Lead React Developer', company: 'Innovate AI', location: 'San Francisco, CA (Remote)', match: 94, skills: ['React', 'TypeScript', 'Tailwind'] },
  { id: 2, title: 'Frontend Engineer', company: 'FinTech Global', location: 'New York, NY', match: 88, skills: ['React', 'Redux', 'Jest'] },
  { id: 3, title: 'Software Engineer, UI', company: 'HealthPlus', location: 'Austin, TX (Hybrid)', match: 82, skills: ['JavaScript', 'React', 'CSS'] },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Applied': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Applied</span>;
    case 'Interview': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Interview</span>;
    case 'Shortlisted': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Shortlisted</span>;
    case 'Rejected': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">Rejected</span>;
    default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
  }
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold sm:hidden mb-6">Good morning, Alex 👋</h1>
      
      {isLoading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-slate-200"></div>
            <div className="h-96 bg-white rounded-2xl border border-slate-200"></div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col gap-8"
        >
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Resume Completion */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                  </div>
                  <span className="text-sm font-bold text-text-primary">75%</span>
                </div>
                <h3 className="font-bold text-text-primary mb-1">Resume Complete</h3>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-3 mb-4 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <button onClick={() => navigate('/resume')} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                Continue Resume <ArrowRight size={16} />
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Sparkles size={20} />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                </div>
                <h3 className="font-bold text-text-primary mb-1">5 AI Suggestions</h3>
                <p className="text-sm text-text-secondary mb-4">Enhance your impact metrics.</p>
              </div>
              <button onClick={() => navigate('/ai-improve')} className="text-sm font-semibold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all">
                Improve Resume <ArrowRight size={16} />
              </button>
            </div>

            {/* Job Matches */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <Briefcase size={20} />
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">+3 New</span>
                </div>
                <h3 className="font-bold text-text-primary mb-1">12 Recommended Jobs</h3>
                <p className="text-sm text-text-secondary mb-4">Based on your skills.</p>
              </div>
              <button onClick={() => navigate('/jobs')} className="text-sm font-semibold text-green-600 flex items-center gap-1 hover:gap-2 transition-all">
                View Jobs <ArrowRight size={16} />
              </button>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <CheckSquare size={20} />
                  </div>
                </div>
                <h3 className="font-bold text-text-primary mb-1">4 Active Applications</h3>
                <p className="text-sm text-text-secondary mb-4">1 interview scheduled.</p>
              </div>
              <button onClick={() => navigate('/applications')} className="text-sm font-semibold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
                Track Applications <ArrowRight size={16} />
              </button>
            </div>

          </div>

          {/* Grid Layout for Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Applications</h2>
                <Link to="/applications" className="text-sm font-semibold text-accent-blue hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-text-secondary text-sm">
                      <th className="p-4 font-medium border-b border-slate-200">Job Title</th>
                      <th className="p-4 font-medium border-b border-slate-200">Company</th>
                      <th className="p-4 font-medium border-b border-slate-200">Date Applied</th>
                      <th className="p-4 font-medium border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                        <td className="p-4 font-semibold text-text-primary">{app.title}</td>
                        <td className="p-4 text-text-secondary">{app.company}</td>
                        <td className="p-4 text-text-secondary flex items-center gap-1.5"><Clock size={14}/> {app.date}</td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/resume')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-accent-blue hover:bg-blue-50 transition-all group">
                    <div className="flex items-center gap-3 font-medium text-text-primary group-hover:text-accent-blue">
                      <FileText size={18} /> Build Resume
                    </div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-accent-blue" />
                  </button>
                  <button onClick={() => navigate('/ai-improve')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-accent-purple hover:bg-purple-50 transition-all group">
                    <div className="flex items-center gap-3 font-medium text-text-primary group-hover:text-accent-purple">
                      <Sparkles size={18} /> Improve With AI
                    </div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-accent-purple" />
                  </button>
                  <button onClick={() => navigate('/jobs')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                    <div className="flex items-center gap-3 font-medium text-text-primary group-hover:text-green-600">
                      <Briefcase size={18} /> Find Jobs
                    </div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-green-600" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Recommended Jobs Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recommended for You</h2>
              <Link to="/jobs" className="text-sm font-semibold text-accent-blue hover:underline">View Matches</Link>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedJobs.map(job => (
                <div key={job.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-lg leading-tight">{job.title}</div>
                      <div className="flex items-center gap-1 text-xs font-bold text-accent-purple bg-purple-50 px-2 py-1 rounded-md whitespace-nowrap">
                        <Sparkles size={12} /> {job.match}% Match
                      </div>
                    </div>
                    <div className="text-sm text-text-secondary mb-1">{job.company}</div>
                    <div className="text-sm text-text-light flex items-center gap-1 mb-4"><MapPin size={14}/> {job.location}</div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <button onClick={() => navigate(`/jobs/${job.id}`)} className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-semibold hover:border-accent-blue hover:text-accent-blue transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
