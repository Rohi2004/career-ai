import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Pencil, Sparkles, CheckCircle2, 
  AlertCircle, BarChart3, FileText, Mail, Phone, MapPin, Link2, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const ResumePreview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data) {
          // Process skills into categories for the preview
          const rawSkills = response.data.skills || [];
          const categoriesMap = {};
          rawSkills.forEach(s => {
            const cat = s.category || 'Other';
            if (!categoriesMap[cat]) categoriesMap[cat] = [];
            categoriesMap[cat].push(s.name);
          });
          const groupedSkills = Object.keys(categoriesMap).map(cat => ({
            category: cat,
            items: categoriesMap[cat]
          }));

          setData({
            personalInfo: response.data.personalInfo || {},
            summary: response.data.summary || '',
            experience: response.data.experience || [],
            education: response.data.education || [],
            projects: response.data.projects || [],
            skills: groupedSkills
          });
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchResume();
    }
  }, [user]);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate PDF generation/download process
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-accent-blue mb-4" />
        <p className="text-text-secondary font-medium">Loading your resume...</p>
      </div>
    );
  }

  // Calculate some basic completion metrics
  const sections = [
    { name: 'Personal Info', complete: Object.keys(data.personalInfo).length > 2 },
    { name: 'Summary', complete: data.summary.length > 20 },
    { name: 'Experience', complete: data.experience.length > 0 },
    { name: 'Education', complete: data.education.length > 0 },
    { name: 'Skills', complete: data.skills.length > 0 },
    { name: 'Projects', complete: data.projects.length > 0 }
  ];
  
  const completedCount = sections.filter(s => s.complete).length;
  const completionPercent = Math.round((completedCount / sections.length) * 100);
  const score = Math.min(Math.round(completionPercent * 0.88), 100); // Faux ATS score based on completion

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col font-sans">
      
      {/* Top Navigation / Header (Hidden in Print) */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 print:hidden shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/resume" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline font-medium">Back to Builder</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <h1 className="font-bold text-text-primary text-lg flex items-center gap-2">
            Resume Preview <span className="hidden sm:inline text-slate-400 font-normal text-sm">— {data.personalInfo.fullName || 'Untitled'}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/resume')} className="hidden sm:flex btn btn-secondary px-4 py-2 text-sm items-center gap-2">
            <Pencil size={16} /> Edit
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="btn btn-primary px-4 py-2 flex items-center gap-2 text-sm shadow-sm"
          >
            <Download size={16} />
            <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center print:block print:max-w-none print:m-0">
          
          {/* A4 Resume Canvas */}
          <div className="flex-1 flex justify-center w-full print:w-full print:block">
            <div className="bg-white shadow-xl rounded-sm w-full max-w-[210mm] min-h-[297mm] overflow-hidden print:shadow-none print:w-full print:min-h-full print:rounded-none">
              
              {/* Resume Document Content */}
              <div className="p-[20mm] md:p-[25mm] text-[11pt] text-slate-800 leading-snug">
                
                {/* Header */}
                <div className="border-b-2 border-slate-800 pb-4 mb-5 text-center">
                  <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900 mb-1">{data.personalInfo.fullName || 'Your Name'}</h1>
                  {data.personalInfo.title && <h2 className="text-lg text-slate-600 font-medium mb-3">{data.personalInfo.title}</h2>}
                  
                  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[9pt] text-slate-600">
                    {data.personalInfo.email && <div className="flex items-center gap-1"><Mail size={12}/> {data.personalInfo.email}</div>}
                    {data.personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12}/> {data.personalInfo.phone}</div>}
                    {data.personalInfo.location && <div className="flex items-center gap-1"><MapPin size={12}/> {data.personalInfo.location}</div>}
                    {data.personalInfo.linkedin && <div className="flex items-center gap-1"><Link2 size={12}/> {data.personalInfo.linkedin.replace('https://', '')}</div>}
                    {data.personalInfo.github && <div className="flex items-center gap-1"><Link2 size={12}/> {data.personalInfo.github.replace('https://', '')}</div>}
                    {data.personalInfo.portfolio && <div className="flex items-center gap-1"><Link2 size={12}/> {data.personalInfo.portfolio.replace('https://', '')}</div>}
                  </div>
                </div>

                {/* Professional Summary */}
                {data.summary && (
                  <div className="mb-5">
                    <p className="text-[10pt] text-justify leading-relaxed">{data.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-[11pt] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Professional Experience</h3>
                    <div className="flex flex-col gap-4">
                      {data.experience.map(exp => (
                        <div key={exp._id || Math.random()}>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-slate-900">{exp.title}</h4>
                            <span className="text-[9pt] font-medium whitespace-nowrap">
                              {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} 
                              {' – '} 
                              {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '')}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="italic text-slate-700">{exp.company}</span>
                            <span className="text-[9pt] text-slate-600">{exp.location}</span>
                          </div>
                          <div className="text-[10pt] whitespace-pre-wrap pl-3 space-y-1 text-slate-700">
                            {exp.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-[11pt] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Projects</h3>
                    <div className="flex flex-col gap-3">
                      {data.projects.map(proj => (
                        <div key={proj._id || Math.random()}>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-slate-900">{proj.name}</h4>
                            {proj.githubUrl && <span className="text-[9pt] text-slate-600">{proj.githubUrl}</span>}
                          </div>
                          <div className="text-[9pt] font-medium text-slate-700 mb-1">
                            {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                          </div>
                          <p className="text-[10pt] text-slate-700">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-[11pt] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Skills</h3>
                    <div className="flex flex-col gap-1.5 text-[10pt]">
                      {data.skills.map((skillGroup, idx) => (
                        <div key={idx} className="flex">
                          <span className="font-bold text-slate-900 w-28 shrink-0">{skillGroup.category}:</span>
                          <span className="text-slate-700">{skillGroup.items.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-[11pt] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Education</h3>
                    <div className="flex flex-col gap-3">
                      {data.education.map(edu => (
                        <div key={edu._id || Math.random()}>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                            <span className="text-[9pt] font-medium">
                              {edu.startDate ? new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} 
                              {' – '} 
                              {edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '')}
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="italic text-slate-700">{edu.institution}</span>
                            {edu.grade && <span className="text-[9pt] text-slate-600">GPA: {edu.grade}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Right Panel: Resume Quality (Hidden in Print) */}
          <div className="w-full lg:w-[320px] shrink-0 print:hidden">
            <div className="sticky top-24 flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-accent-blue" /> Resume Quality
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-secondary">Completion</span>
                  <span className="text-sm font-bold text-green-500">{completionPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
                  <div className={`h-full ${completionPercent === 100 ? 'bg-green-500' : 'bg-orange-500'} w-full rounded-full`} style={{width: `${completionPercent}%`}}></div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-secondary">AI ATS Score</span>
                  <span className="text-sm font-bold text-accent-blue">{score}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-accent-blue rounded-full" style={{width: `${score}%`}}></div>
                </div>
                
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light mb-3">Sections</h4>
                <ul className="space-y-2 mb-6">
                  {sections.map(sec => (
                    <li key={sec.name} className={`flex items-center gap-2 text-sm font-medium ${sec.complete ? 'text-slate-600' : 'text-slate-400'}`}>
                      {sec.complete ? <CheckCircle2 size={14} className="text-green-500 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"></div>}
                      {sec.name}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/ai-improve')} className="btn btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-100 transition-all">
                    <Sparkles size={16} className="text-accent-purple" /> Improve With AI
                  </button>
                  <button onClick={() => navigate('/resume')} className="btn btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm shadow-sm">
                    <Pencil size={16} /> Edit Resume
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ResumePreview;
