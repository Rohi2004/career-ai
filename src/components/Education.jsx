import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Pencil, Trash2, GraduationCap, 
  ArrowLeft, CheckCircle2, AlertCircle, Calendar, BookOpen, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Education = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load from API
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data && response.data.education) {
          // Add a temporary local id for UI rendering and editing if _id doesn't exist yet
          const edus = response.data.education.map(e => ({...e, id: e._id || Math.random().toString()}));
          setEducations(edus);
        }
      } catch (err) {
        console.error('Failed to load education:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchResume();
    }
  }, [user]);

  const saveToBackend = async (newEducations) => {
    setSaving(true);
    try {
      const response = await api.put('/resumes/me', { education: newEducations }, user?.token);
      if (response.success && response.data) {
        setEducations(response.data.education.map(e => ({...e, id: e._id || Math.random().toString()})));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save education to backend', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    degree: '',
    institution: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
    current: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handlers
  const openModal = (edu = null) => {
    if (edu) {
      // Map endDate to YYYY-MM format if it exists
      const formatToMonth = (dateStr) => dateStr ? dateStr.substring(0, 7) : '';
      setFormData({
        ...edu,
        startDate: formatToMonth(edu.startDate),
        endDate: formatToMonth(edu.endDate),
        grade: edu.grade || edu.gpa || ''
      });
      setEditingId(edu.id);
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
    if (!formData.degree?.trim()) newErrors.degree = 'Degree is required';
    if (!formData.institution?.trim()) newErrors.institution = 'Institution is required';
    if (!formData.fieldOfStudy?.trim()) newErrors.fieldOfStudy = 'Field of Study is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let newEducations;
    if (editingId) {
      newEducations = educations.map(edu => edu.id === editingId ? { ...formData, _id: edu._id } : edu);
    } else {
      newEducations = [...educations, { ...formData }];
    }

    const success = await saveToBackend(newEducations);
    if (success) {
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDelete = async (id) => {
    const newEducations = educations.filter(edu => edu.id !== id);
    await saveToBackend(newEducations);
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
              <span className="font-semibold text-sm">Education saved successfully!</span>
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
            <span className="text-text-primary">Education</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Education</h1>
              <p className="text-text-secondary text-sm">Add your academic background to your professional resume.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/resume" className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </Link>
              <button onClick={() => openModal()} className="btn btn-primary px-4 py-2 flex items-center gap-2 text-sm shadow-sm">
                <Plus size={16} /> Add Education
              </button>
            </div>
          </div>
        </div>

        {/* Education List */}
        <div className="flex-1">
          {educations.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No education added yet</h3>
              <p className="text-text-secondary mb-6 max-w-md">Highlighting your academic achievements can significantly increase your chances of landing an interview.</p>
              <button onClick={() => openModal()} className="btn btn-primary px-5 py-2.5">
                Add Your Education
              </button>
            </div>
          ) : (
            // List State
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  {saving && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent-blue"/></div>}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-text-primary">{edu.degree}</h3>
                        <p className="font-medium text-accent-blue text-sm">{edu.fieldOfStudy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(edu)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-text-secondary hover:text-accent-blue flex items-center justify-center transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(edu.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 text-text-secondary hover:text-red-500 flex items-center justify-center transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-slate-400" />
                      <span className="font-medium text-text-primary">{edu.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <span>
                        {edu.startDate ? new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''} 
                        {' — '} 
                        {edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '')}
                      </span>
                    </div>
                    {edu.grade && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider w-8 text-left">GRADE</span>
                        <span>{edu.grade}</span>
                      </div>
                    )}
                  </div>
                  
                  {edu.description && (
                    <p className="mt-4 text-sm text-text-secondary leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
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
                      {editingId ? 'Edit Education' : 'Add Education'}
                    </h2>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full">
                      <Trash2 size={20} className="opacity-0" />{/* Spacer basically since we don't import X */}
                    </button>
                  </div>
                  
                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Degree */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Degree <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="degree" value={formData.degree} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.degree ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. Bachelor of Science" 
                        />
                        {errors.degree && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.degree}</p>}
                      </div>

                      {/* Institution */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Institution <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="institution" value={formData.institution} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.institution ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. University of Technology" 
                        />
                        {errors.institution && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.institution}</p>}
                      </div>

                      {/* Field of Study */}
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Field of Study <span className="text-red-500">*</span></label>
                        <input 
                          type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.fieldOfStudy ? 'border-red-500 bg-red-50/30' : 'border-slate-300'} focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all`}
                          placeholder="e.g. Computer Science" 
                        />
                        {errors.fieldOfStudy && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{errors.fieldOfStudy}</p>}
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
                          type="month" name="endDate" value={formData.endDate} onChange={handleChange} disabled={formData.current}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-text-primary disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Current & GPA */}
                      <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" name="current" checked={formData.current} onChange={handleChange}
                              className="w-5 h-5 rounded border-slate-300 text-accent-blue focus:ring-accent-blue/30 cursor-pointer peer appearance-none checked:bg-accent-blue checked:border-accent-blue transition-all"
                            />
                            <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3}/>
                          </div>
                          <span className="text-sm font-medium text-text-primary select-none">I currently study here</span>
                        </label>
                        
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-semibold text-text-primary whitespace-nowrap">Grade / GPA</label>
                          <input 
                            type="text" name="grade" value={formData.grade} onChange={handleChange}
                            className="w-24 px-3 py-2 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all text-center"
                            placeholder="e.g. 3.8" 
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Description (optional)</label>
                        <textarea 
                          name="description" value={formData.description} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 outline-none transition-all h-28 resize-y"
                          placeholder="Describe any coursework, honors, or activities..." 
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
                      {saving ? 'Saving...' : 'Save Education'}
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

export default Education;
