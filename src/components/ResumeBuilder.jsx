import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link2, Mail, MapPin, Phone, Download, Eye, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Full resume state
  const [resumeData, setResumeData] = useState({
    personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  // Load from API
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data) {
          setResumeData(response.data);
        } else if (response.success && response.data === null) {
          // If no resume exists, backend returns null. We create an empty one.
          const createResponse = await api.post('/resumes', {}, user?.token);
          if (createResponse.success && createResponse.data) {
            setResumeData(createResponse.data);
          }
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

  // Handlers
  const handlePersonalInfoChange = (e) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [e.target.name]: e.target.value }
    }));
  };

  const handleSummaryChange = (e) => {
    setResumeData(prev => ({
      ...prev,
      summary: e.target.value
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const payload = {
        personalInfo: resumeData.personalInfo,
        summary: resumeData.summary
      };
      const response = await api.put('/resumes/me', payload, user?.token);
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let score = 0;
    let total = 6;
    if (resumeData.personalInfo?.fullName && resumeData.personalInfo?.email) score++;
    if (resumeData.summary?.length > 10) score++;
    if (resumeData.experience?.length > 0) score++;
    if (resumeData.skills?.length > 0) score++;
    if (resumeData.projects?.length > 0) score++;
    if (resumeData.education?.length > 0) score++;
    return Math.round((score / total) * 100);
  };

  const completion = calculateCompletion();
  const { personalInfo, summary, experience, skills, projects, education } = resumeData;

  if (loading) {
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
      <div className="flex flex-col lg:flex-row gap-8 h-full relative">
        
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
              <span className="font-semibold text-sm">Resume saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT SIDE: BUILDER FORM */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 lg:pb-32">
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-text-primary">Resume Builder</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text-secondary">{completion}% Complete</span>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Name</label>
                <input type="text" name="fullName" value={personalInfo?.fullName || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Professional Title</label>
                <input type="text" name="title" value={personalInfo?.title || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
                <input type="email" name="email" value={personalInfo?.email || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                <input type="tel" name="phone" value={personalInfo?.phone || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. (555) 123-4567" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Location</label>
                <input type="text" name="location" value={personalInfo?.location || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. New York, NY" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">LinkedIn URL (optional)</label>
                <input type="text" name="linkedin" value={personalInfo?.linkedin || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. linkedin.com/in/janedoe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">GitHub URL (optional)</label>
                <input type="text" name="github" value={personalInfo?.github || ''} onChange={handlePersonalInfoChange} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors" placeholder="e.g. github.com/janedoe" />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Professional Summary</h2>
            <textarea 
              value={summary || ''}
              onChange={handleSummaryChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-accent-blue outline-none transition-colors h-32 resize-y"
              placeholder="Briefly describe your professional background and key strengths..."
            ></textarea>
          </section>

          {/* Experience */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Experience</h2>
              <p className="text-sm text-text-secondary">Add your professional work history.</p>
            </div>
            <button onClick={() => navigate('/resume/experience')} className="btn btn-secondary px-4 py-2 text-sm">
              Manage Experience
            </button>
          </section>

          {/* Skills */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Skills</h2>
              <p className="text-sm text-text-secondary">Highlight your technical and soft skills.</p>
            </div>
            <button onClick={() => navigate('/resume/skills')} className="btn btn-secondary px-4 py-2 text-sm">
              Manage Skills
            </button>
          </section>

          {/* Projects */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Projects</h2>
              <p className="text-sm text-text-secondary">Showcase your technical achievements.</p>
            </div>
            <button onClick={() => navigate('/resume/projects')} className="btn btn-secondary px-4 py-2 text-sm">
              Manage Projects
            </button>
          </section>

          {/* Education */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Education</h2>
              <p className="text-sm text-text-secondary">Manage your degrees and certifications.</p>
            </div>
            <button onClick={() => navigate('/resume/education')} className="btn btn-secondary px-4 py-2 text-sm">
              Manage Education
            </button>
          </section>

        </div>

        {/* RIGHT SIDE: PREVIEW */}
        <div className="w-full lg:w-[45%] xl:w-[50%] flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/resume/preview')} className="btn btn-secondary px-3 py-1.5 flex items-center gap-2 text-sm">
                <Eye size={16} /> Full Preview
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveResume} disabled={saving} className="btn btn-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-70">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Resume'}
              </button>
            </div>
          </div>

          <div className="bg-slate-200 rounded-lg p-2 md:p-8 overflow-y-auto flex-1 flex justify-center sticky top-20 shadow-inner">
            <div className="bg-white w-[210mm] min-h-[297mm] shadow-lg p-10 md:p-12 shrink-0 flex flex-col text-slate-800 scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top">
              
              {/* Preview Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-serif text-slate-900 mb-1 font-bold">{personalInfo?.fullName || 'Your Name'}</h1>
                <div className="text-lg text-slate-600 mb-3">{personalInfo?.title || 'Professional Title'}</div>
                
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  {personalInfo?.email && <div className="flex items-center gap-1"><Mail size={12}/> {personalInfo.email}</div>}
                  {personalInfo?.phone && <div className="flex items-center gap-1"><Phone size={12}/> {personalInfo.phone}</div>}
                  {personalInfo?.location && <div className="flex items-center gap-1"><MapPin size={12}/> {personalInfo.location}</div>}
                  {personalInfo?.linkedin && <div className="flex items-center gap-1"><Link2 size={12}/> {personalInfo.linkedin.replace('https://', '')}</div>}
                  {personalInfo?.github && <div className="flex items-center gap-1"><Link2 size={12}/> {personalInfo.github.replace('https://', '')}</div>}
                </div>
              </div>

              {/* Preview Summary */}
              {summary && (
                <div className="mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Professional Summary</h2>
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{summary}</p>
                </div>
              )}

              {/* Preview Experience */}
              {experience?.length > 0 && experience[0].title && (
                <div className="mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Experience</h2>
                  <div className="flex flex-col gap-3">
                    {experience.map((exp) => (
                      <div key={exp._id || exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <div className="font-bold text-slate-800">{exp.title}</div>
                          <div className="text-xs text-slate-600 font-medium">
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '')}
                          </div>
                        </div>
                        <div className="flex justify-between items-baseline mb-2">
                          <div className="text-sm text-slate-600 font-medium italic">{exp.company}</div>
                          <div className="text-xs text-slate-500">{exp.location}</div>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Projects */}
              {projects?.length > 0 && projects[0].name && (
                <div className="mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Projects</h2>
                  <div className="flex flex-col gap-3">
                    {projects.map((proj) => (
                      <div key={proj._id || proj.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{proj.name}</span>
                            {proj.technologies?.length > 0 && <span className="text-xs text-slate-500">| {proj.technologies.join(', ')}</span>}
                          </div>
                          {proj.githubUrl && <div className="text-xs text-slate-500">{proj.githubUrl}</div>}
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Skills */}
              {skills?.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Skills</h2>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {skills.map(s => typeof s === 'string' ? s : s.name).join(' • ')}
                  </p>
                </div>
              )}

              {/* Preview Education */}
              {education?.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Education</h2>
                  {education.map((edu) => (
                    <div key={edu._id || edu.id} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="font-bold text-slate-800">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                        <div className="text-xs text-slate-600 font-medium">
                          {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).getFullYear() : '')}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 font-medium italic">{edu.institution} {edu.grade && `• GPA: ${edu.grade}`}</div>
                      {edu.description && <p className="text-xs leading-relaxed text-slate-700 mt-1 whitespace-pre-wrap">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
