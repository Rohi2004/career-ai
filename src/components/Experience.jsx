import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Pencil, Trash2, Briefcase, 
  ArrowLeft, CheckCircle2, AlertCircle, Calendar, MapPin, Building, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Experience = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load from API
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data && response.data.experience) {
          const exps = response.data.experience.map(e => ({...e, id: e._id || Math.random().toString()}));
          setExperiences(exps);
        }
      } catch (err) {
        console.error('Failed to load experience:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchResume();
    }
  }, [user]);

  const saveToBackend = async (newExperiences) => {
    setSaving(true);
    try {
      const response = await api.put('/resumes/me', { experience: newExperiences }, user?.token);
      if (response.success && response.data) {
        setExperiences(response.data.experience.map(e => ({...e, id: e._id || Math.random().toString()})));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save experience to backend', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handlers
  const openModal = (exp = null) => {
    if (exp) {
      const formatToMonth = (dateStr) => dateStr ? dateStr.substring(0, 7) : '';
      setFormData({
        ...exp,
        startDate: formatToMonth(exp.startDate),
        endDate: formatToMonth(exp.endDate)
      });
      setEditingId(exp.id);
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Auto-clear endDate if 'current' is checked
    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, current: true, endDate: '' }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Job Title is required';
    if (!formData.company?.trim()) newErrors.company = 'Company is required';
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let newExperiences;
    if (editingId) {
      newExperiences = experiences.map(exp => exp.id === editingId ? { ...formData, _id: exp._id } : exp);
    } else {
      newExperiences = [...experiences, { ...formData }];
    }

    const success = await saveToBackend(newExperiences);
    if (success) {
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    const newExperiences = experiences.filter(exp => exp.id !== id);
    await saveToBackend(newExperiences);
  };

  // Sort experiences by start date (descending)
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate || 0) - new Date(a.startDate || 0);
  });

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
              <span className="font-semibold text-sm">Experience saved successfully!</span>
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
            <span className="text-text-primary">Experience</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Work Experience</h1>
              <p className="text-text-secondary text-sm">Add your professional experience to build a stronger resume.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/resume" className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </Link>
              <button onClick={() => openModal()} className="btn btn-primary px-4 py-2 flex items-center gap-2 text-sm shadow-sm">
                <Plus size={16} /> Add Experience
              </button>
            </div>
          </div>
        </div>

        {/* Experience List - Timeline Layout */}
        <div className="flex-1 pb-12">
          {sortedExperiences.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No work experience added yet</h3>
              <p className="text-text-secondary mb-6 max-w-md">Employers look for relevant work history. Add your past roles to stand out.</p>
              <button onClick={() => openModal()} className="btn btn-primary px-5 py-2.5">
                Add Your Experience
              </button>
            </div>
          ) : (
            // List State
            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 pl-6 md:pl-10 space-y-8 py-4">
              {sortedExperiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {saving && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl"><Loader2 className="w-6 h-6 animate-spin text-accent-blue"/></div>}
                  {/* Timeline Node */}
                  <div className={`absolute -left-[35px] md:-left-[51px] w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${exp.current ? 'bg-accent-blue' : 'bg-slate-300 group-hover:bg-accent-blue transition-colors'}`}></div>
                  
                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                    
                    {exp.current && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-accent-blue text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        Current
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-text-primary">{exp.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-text-secondary font-medium">
                          <div className="flex items-center gap-1.5"><Building size={16} className="text-accent-blue"/> <span className="text-text-primary">{exp.company}</span></div>
                          <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> {exp.location}</div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md text-xs">
                            <Calendar size={14} className="text-slate-400"/> 
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} — {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end md:self-start opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(exp)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-text-secondary hover:text-accent-blue flex items-center justify-center transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(exp.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 text-text-secondary hover:text-red-500 flex items-center justify-center transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <div className="mt-4 text-sm text-text-secondary leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                      {editingId ? 'Edit Experience' : 'Add Experience'}
                    </h2>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
                      <Trash2 size={20} className="opacity-0" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Job Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Job Title <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="title" value={formData.title} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. Senior Frontend Engineer" 
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.title}</p>}
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Company <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="company" value={formData.company} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.company ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. TechCorp Inc." 
                        />
                        {errors.company && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.company}</p>}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Location</label>
                        <input 
                          type="text" name="location" value={formData.location} onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all"
                          placeholder="e.g. San Francisco, CA or Remote" 
                        />
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Start Date <span className="text-red-500">*</span></label>
                        <input 
                          type="month" name="startDate" value={formData.startDate} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.startDate ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-text-primary`}
                        />
                        {errors.startDate && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.startDate}</p>}
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">End Date</label>
                        <input 
                          type="month" name="endDate" value={formData.endDate} onChange={handleChange} disabled={formData.current}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-text-primary disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Current Checkbox */}
                      <div className="md:col-span-2 flex items-center gap-3 cursor-pointer group mt-1">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" id="current" name="current" checked={formData.current} onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer peer appearance-none checked:bg-accent-blue checked:border-accent-blue transition-all"
                          />
                          <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3}/>
                        </div>
                        <label htmlFor="current" className="text-sm font-medium text-text-primary select-none cursor-pointer">I currently work here</label>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Responsibilities</label>
                        <textarea 
                          name="description" value={formData.description} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all h-32 resize-y"
                          placeholder="Describe your responsibilities and achievements..." 
                        />
                      </div>
                    </div>
                    
                  </form>
                  
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
                    <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-semibold text-text-secondary hover:bg-slate-200 transition-colors" disabled={saving}>
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-primary px-6 py-2.5 flex items-center gap-2" disabled={saving}>
                      {saving && <Loader2 size={16} className="animate-spin" />}
                      {saving ? 'Saving...' : 'Save Experience'}
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

export default Experience;
