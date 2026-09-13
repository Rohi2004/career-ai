import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Pencil, Trash2, FolderGit2, 
  ArrowLeft, CheckCircle2, AlertCircle, Link2, ExternalLink, Calendar, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load from API
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data && response.data.projects) {
          const projs = response.data.projects.map(p => ({...p, id: p._id || Math.random().toString()}));
          setProjects(projs);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchResume();
    }
  }, [user]);

  const saveToBackend = async (newProjects) => {
    setSaving(true);
    try {
      // Map 'github' and 'liveDemo' to backend fields if necessary, or just send as is.
      // Backend schema uses: githubUrl, liveUrl, technologies (array of strings).
      const mappedProjects = newProjects.map(p => ({
        ...p,
        githubUrl: p.github,
        liveUrl: p.liveDemo,
        technologies: typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()).filter(Boolean) : p.technologies
      }));

      const response = await api.put('/resumes/me', { projects: mappedProjects }, user?.token);
      if (response.success && response.data) {
        const projs = response.data.projects.map(p => ({
          ...p,
          id: p._id || Math.random().toString(),
          github: p.githubUrl,
          liveDemo: p.liveUrl,
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies
        }));
        setProjects(projs);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save projects to backend', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    github: '',
    liveDemo: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handlers
  const openModal = (proj = null) => {
    if (proj) {
      const formatToMonth = (dateStr) => dateStr ? dateStr.substring(0, 7) : '';
      setFormData({
        ...proj,
        startDate: formatToMonth(proj.startDate),
        endDate: formatToMonth(proj.endDate)
      });
      setEditingId(proj.id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Project Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let newProjects;
    if (editingId) {
      newProjects = projects.map(proj => proj.id === editingId ? { ...formData, _id: proj._id } : proj);
    } else {
      newProjects = [...projects, { ...formData }];
    }

    const success = await saveToBackend(newProjects);
    if (success) {
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    const newProjects = projects.filter(proj => proj.id !== id);
    await saveToBackend(newProjects);
  };

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
              <span className="font-semibold text-sm">Project saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/dashboard" className="hover:text-accent-blue transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <Link to="/resume" className="hover:text-accent-blue transition-colors">Resume Builder</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">Projects</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Projects</h1>
              <p className="text-text-secondary text-sm">Showcase your best work and technical achievements.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/resume" className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </Link>
              <button onClick={() => openModal()} className="btn btn-primary px-4 py-2 flex items-center gap-2 text-sm shadow-sm">
                <Plus size={16} /> Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 pb-12">
          {projects.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <FolderGit2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No projects added yet</h3>
              <p className="text-text-secondary mb-6 max-w-md">Personal and open-source projects are a great way to demonstrate your practical skills to employers.</p>
              <button onClick={() => openModal()} className="btn btn-primary px-5 py-2.5">
                Add a Project
              </button>
            </div>
          ) : (
            // Grid State
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const techStr = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '');
                const tags = techStr.split(',').map(t => t.trim()).filter(Boolean);
                
                return (
                  <div key={proj.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group h-full relative overflow-hidden">
                    {saving && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent-blue"/></div>}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                          <FolderGit2 size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-text-primary line-clamp-1">{proj.name}</h3>
                          {(proj.startDate || proj.endDate) && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-text-light mt-0.5">
                              <Calendar size={12} />
                              <span>
                                {proj.startDate ? new Date(proj.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Unknown'} 
                                {' — '} 
                                {proj.endDate ? new Date(proj.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(proj)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-text-secondary hover:text-accent-blue flex items-center justify-center transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(proj.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 text-text-secondary hover:text-red-500 flex items-center justify-center transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1 whitespace-pre-wrap">
                      {proj.description}
                    </p>
                    
                    <div className="flex flex-col gap-4 mt-auto">
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {(proj.github || proj.liveDemo) && (
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                          {proj.github && (
                            <a href={`https://${proj.github.replace('https://', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
                              <Link2 size={16} /> GitHub
                            </a>
                          )}
                          {proj.liveDemo && (
                            <a href={`https://${proj.liveDemo.replace('https://', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-accent-blue hover:text-blue-700 transition-colors">
                              <ExternalLink size={16} /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                onClick={closeModal}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden">
                  
                  <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                      {editingId ? 'Edit Project' : 'Add Project'}
                    </h2>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
                      <Trash2 size={20} className="opacity-0" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Project Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Project Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. E-commerce Platform" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
                      </div>

                      {/* Technologies */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Technologies / Skills</label>
                        <input 
                          type="text" name="technologies" value={formData.technologies} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all"
                          placeholder="e.g. React, Node.js, MongoDB (comma separated)" 
                        />
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Start Date</label>
                        <input 
                          type="month" name="startDate" value={formData.startDate} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-text-primary"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">End Date</label>
                        <input 
                          type="month" name="endDate" value={formData.endDate} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-text-primary"
                        />
                      </div>

                      {/* GitHub URL */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">GitHub URL (optional)</label>
                        <input 
                          type="text" name="github" value={formData.github} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all"
                          placeholder="e.g. github.com/username/repo" 
                        />
                      </div>

                      {/* Live Demo URL */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Live Demo URL (optional)</label>
                        <input 
                          type="text" name="liveDemo" value={formData.liveDemo} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all"
                          placeholder="e.g. myproject.com" 
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Description <span className="text-red-500">*</span></label>
                        <textarea 
                          name="description" value={formData.description} onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all h-32 resize-y`}
                          placeholder="Describe the project, your role, and the impact..." 
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.description}</p>}
                      </div>
                    </div>
                    
                  </form>
                  
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
                    <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary hover:bg-slate-200 transition-colors" disabled={saving}>
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-primary px-6 py-2.5 flex items-center gap-2" disabled={saving}>
                      {saving && <Loader2 size={16} className="animate-spin" />}
                      {saving ? 'Saving...' : 'Save Project'}
                    </button>
                  </div>
                  
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default Projects;
