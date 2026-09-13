import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Save, Trash2, X, Image as ImageIcon,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isEditing = Boolean(id);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experienceLevel: '',
    salaryRange: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    preferredSkills: '',
    qualifications: '',
    applicationDeadline: '',
    status: 'Active'
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/jobs/${id}`, user?.token);
        if (response.success && response.data) {
          const job = response.data;
          setFormData({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            type: job.type || 'Full-time',
            experienceLevel: job.experienceLevel || '',
            salaryRange: job.salaryRange || '',
            description: job.description || '',
            responsibilities: (job.responsibilities || []).join('\n'),
            requiredSkills: (job.requirements || []).join(', '),
            preferredSkills: '', // Assuming preferredSkills not explicitly handled, or modify backend model
            qualifications: '', // Assuming qualifications part of description or requirements
            applicationDeadline: '', // Add to backend if needed
            status: job.status || 'Active'
          });
        } else {
          setError(response.message || 'Failed to fetch job details');
        }
      } catch (err) {
        setError('An error occurred while fetching the job.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditing && user?.token) {
      fetchJob();
    }
  }, [id, isEditing, user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError('Title, Company, Location, and Description are required fields.');
      return;
    }

    setIsSaving(true);

    const jobPayload = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      experienceLevel: formData.experienceLevel,
      salaryRange: formData.salaryRange,
      description: formData.description,
      responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      requirements: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      status: formData.status
    };

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/jobs/${id}`, jobPayload, user?.token);
      } else {
        response = await api.post('/jobs', jobPayload, user?.token);
      }

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(response.message || 'Failed to save job');
      }
    } catch (err) {
      setError('An error occurred while saving the job.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job? This cannot be undone.")) {
      try {
        const response = await api.delete(`/jobs/${id}`, user?.token);
        if (response.success) {
          navigate('/admin');
        } else {
          alert(response.message || 'Failed to delete job');
        }
      } catch (err) {
        alert('An error occurred while deleting the job.');
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 pb-12 relative">
        
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
            >
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="font-semibold text-sm">Job {isEditing ? 'updated' : 'created'} successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb & Header */}
        <div>
          <nav className="flex items-center text-sm text-text-secondary font-medium mb-4">
            <Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
            <ChevronRight size={14} className="mx-2 text-slate-300" />
            <span className="text-text-primary">{isEditing ? 'Edit Job' : 'Add New Job'}</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-text-primary">
              {isEditing ? 'Edit Job Listing' : 'Create New Job Listing'}
            </h1>
            {isEditing && (
              <button onClick={handleDelete} className="btn btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 flex items-center gap-2 border-red-200">
                <Trash2 size={16} /> Delete Job
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* 1. Basic Info */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-6 border-b border-slate-100 pb-3">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Job Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="e.g. Senior Product Designer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Company Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="company" value={formData.company} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Location <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Company Logo</label>
                <div className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 mb-1">Click to upload image</span>
                  <span className="text-xs text-slate-400">PNG, JPG up to 2MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Job Details */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-6 border-b border-slate-100 pb-3">Job Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Job Type</label>
                <select 
                  name="type" value={formData.type} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Experience Level</label>
                <input 
                  type="text" name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="e.g. Mid-Level, 3-5 years"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Salary Range</label>
                <input 
                  type="text" name="salaryRange" value={formData.salaryRange} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="e.g. $90k - $120k"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Application Deadline</label>
                <input 
                  type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Job Description <span className="text-red-500">*</span></label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-32 resize-y text-sm"
                  placeholder="Describe the role in detail..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Responsibilities (One per line)</label>
                <textarea 
                  name="responsibilities" value={formData.responsibilities} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24 resize-y text-sm"
                  placeholder="- Lead development of..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Qualifications (One per line)</label>
                <textarea 
                  name="qualifications" value={formData.qualifications} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-24 resize-y text-sm"
                  placeholder="- Bachelor's degree in..."
                />
              </div>
            </div>
          </div>

          {/* 3. Skills & Status */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-6 border-b border-slate-100 pb-3">Skills & Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Required Skills (Comma separated)</label>
                <input 
                  type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="React, Node.js, SQL"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Preferred Skills (Comma separated)</label>
                <input 
                  type="text" name="preferredSkills" value={formData.preferredSkills} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                  placeholder="AWS, Docker, GraphQL"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:w-1/2">
              <label className="text-sm font-semibold text-slate-700">Job Status</label>
              <select 
                name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
              >
                <option value="Active">Active (Published)</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto btn btn-secondary px-6 py-3 font-semibold"
            >
              <X size={18} className="mr-2 inline" /> Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full sm:w-auto btn bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save size={18} /> {isEditing ? 'Update Job' : 'Create Job'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminJobForm;
