import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, X, ArrowLeft, CheckCircle2, 
  Settings, TerminalSquare, UserCheck, AlertCircle, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const SUGGESTED_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 
  'MongoDB', 'Python', 'Git', 'HTML', 'CSS', 'SQL', 
  'Leadership', 'Communication', 'AWS', 'Docker'
];

const CATEGORIES = {
  TECHNICAL: 'Technical Skills',
  SOFT: 'Soft Skills',
  TOOLS: 'Tools & Technologies'
};

const Skills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local state for skills
  const [skills, setSkills] = useState([]);
  
  // Load from API
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/resumes/me', user?.token);
        if (response.success && response.data && response.data.skills) {
          const s = response.data.skills.map(sk => ({...sk, id: sk._id || Math.random().toString()}));
          setSkills(s);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.token) {
      fetchResume();
    }
  }, [user]);

  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.TECHNICAL);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const saveToBackend = async (newSkills) => {
    setSaving(true);
    try {
      const response = await api.put('/resumes/me', { skills: newSkills }, user?.token);
      if (response.success && response.data) {
        setSkills(response.data.skills.map(sk => ({...sk, id: sk._id || Math.random().toString()})));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save skills to backend', err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (e, skillName = newSkill, category = selectedCategory) => {
    if (e) e.preventDefault();
    const trimmedName = skillName.trim();
    
    if (!trimmedName) {
      setError('Skill name cannot be empty');
      return;
    }
    
    if (skills.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This skill is already added');
      return;
    }

    const newSkills = [...skills, { name: trimmedName, category }];
    setSkills(newSkills.map(s => ({...s, id: s.id || Math.random().toString()})));
    setNewSkill('');
    setError('');
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const startEditing = (skill) => {
    setEditingId(skill.id);
    setEditValue(skill.name);
  };

  const saveEdit = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      handleRemoveSkill(id);
    } else {
      setSkills(skills.map(s => s.id === id ? { ...s, name: trimmed } : s));
    }
    setEditingId(null);
  };

  const handleSave = async () => {
    const success = await saveToBackend(skills);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Group skills by category
  const technicalSkills = skills.filter(s => s.category === CATEGORIES.TECHNICAL);
  const softSkills = skills.filter(s => s.category === CATEGORIES.SOFT);
  const toolSkills = skills.filter(s => s.category === CATEGORIES.TOOLS);

  // Resume Strength Indicator (Max strength around 15 skills)
  const strengthPercentage = Math.min(Math.round((skills.length / 15) * 100), 100);
  let strengthLabel = 'Needs Improvement';
  let strengthColor = 'bg-red-500';
  if (strengthPercentage >= 40) { strengthLabel = 'Good'; strengthColor = 'bg-orange-500'; }
  if (strengthPercentage >= 70) { strengthLabel = 'Strong'; strengthColor = 'bg-green-500'; }

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
              <span className="font-semibold text-sm">Skills saved successfully!</span>
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
            <span className="text-text-primary">Skills</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Skills</h1>
              <p className="text-text-secondary text-sm">Showcase the skills that make you stand out to employers.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/resume" className="btn btn-secondary px-4 py-2 flex items-center gap-2 text-sm">
                <ArrowLeft size={16} /> Back
              </Link>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary px-5 py-2 flex items-center gap-2 text-sm shadow-sm disabled:opacity-70">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? 'Saving...' : 'Save Skills'}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          // Loading State
          <div className="flex-1 flex flex-col gap-6 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-6 pb-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Add Skill & Strength */}
              <div className="flex flex-col gap-6">
                
                {/* Add Skill Form */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Add a Skill</h2>
                  <form onSubmit={handleAddSkill} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-1.5">Category</label>
                      <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-accent-blue outline-none transition-colors text-sm font-medium text-text-primary"
                      >
                        <option value={CATEGORIES.TECHNICAL}>{CATEGORIES.TECHNICAL}</option>
                        <option value={CATEGORIES.SOFT}>{CATEGORIES.SOFT}</option>
                        <option value={CATEGORIES.TOOLS}>{CATEGORIES.TOOLS}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-1.5">Skill Name</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newSkill}
                          onChange={(e) => { setNewSkill(e.target.value); setError(''); }}
                          className={`flex-1 px-3 py-2.5 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-300 focus:border-accent-blue focus:ring-accent-blue/10'} focus:ring-4 outline-none transition-all text-sm`}
                          placeholder="e.g. Node.js"
                        />
                        <button type="submit" className="btn btn-primary px-4 py-2 text-sm shadow-sm">
                          <Plus size={18} />
                        </button>
                      </div>
                      {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
                    </div>
                  </form>
                </div>

                {/* Strength Indicator */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold">Resume Strength</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${strengthColor}`}>{strengthLabel}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${strengthColor}`} style={{ width: `${strengthPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3">
                    You have added <span className="font-bold text-text-primary">{skills.length}</span> skills. A strong resume usually highlights 10-15 key skills.
                  </p>
                </div>

              </div>

              {/* Right Column - Skill Lists & Suggestions */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Suggestions */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-3">Suggested Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SKILLS.map(skill => {
                      const isAdded = skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                      return (
                        <button 
                          key={skill}
                          disabled={isAdded}
                          onClick={() => handleAddSkill(null, skill, CATEGORIES.TECHNICAL)}
                          className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                            isAdded 
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                              : 'bg-white border-slate-200 text-text-primary hover:border-accent-blue hover:text-accent-blue hover:bg-blue-50 shadow-sm'
                          }`}
                        >
                          {isAdded ? <CheckCircle2 size={14} className="text-slate-400" /> : <Plus size={14} />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Added Skills Categories */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1">
                  <h2 className="text-xl font-bold mb-6">Your Skills <span className="text-xs font-normal text-text-secondary ml-2">(Don't forget to click Save)</span></h2>
                  
                  {skills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                        <TerminalSquare size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary mb-2">No skills added yet</h3>
                      <p className="text-text-secondary mb-6 max-w-sm">Skills are critical keywords that help Applicant Tracking Systems (ATS) match you with jobs.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8 relative">
                      {saving && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent-blue"/></div>}
                      {/* Technical Skills */}
                      {technicalSkills.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <TerminalSquare size={16} className="text-accent-blue"/> {CATEGORIES.TECHNICAL}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {technicalSkills.map(skill => (
                              <SkillChip key={skill.id} skill={skill} onRemove={handleRemoveSkill} editingId={editingId} startEditing={startEditing} saveEdit={saveEdit} editValue={editValue} setEditValue={setEditValue} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tools & Technologies */}
                      {toolSkills.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Settings size={16} className="text-purple-500"/> {CATEGORIES.TOOLS}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {toolSkills.map(skill => (
                              <SkillChip key={skill.id} skill={skill} onRemove={handleRemoveSkill} editingId={editingId} startEditing={startEditing} saveEdit={saveEdit} editValue={editValue} setEditValue={setEditValue} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Soft Skills */}
                      {softSkills.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                            <UserCheck size={16} className="text-green-500"/> {CATEGORIES.SOFT}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {softSkills.map(skill => (
                              <SkillChip key={skill.id} skill={skill} onRemove={handleRemoveSkill} editingId={editingId} startEditing={startEditing} saveEdit={saveEdit} editValue={editValue} setEditValue={setEditValue} />
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Sub-component for individual skill chip to handle local editing
const SkillChip = ({ skill, onRemove, editingId, startEditing, saveEdit, editValue, setEditValue }) => {
  const isEditing = editingId === skill.id;

  if (isEditing) {
    return (
      <div className="flex items-center">
        <input 
          autoFocus
          type="text" 
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => saveEdit(skill.id)}
          onKeyDown={(e) => e.key === 'Enter' && saveEdit(skill.id)}
          className="px-3 py-1.5 rounded-lg border border-accent-blue bg-blue-50 text-sm font-medium outline-none shadow-sm w-32"
        />
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm">
      <span 
        onClick={() => startEditing(skill)} 
        className="cursor-text hover:text-accent-blue transition-colors"
        title="Click to edit"
      >
        {skill.name}
      </span>
      <button 
        onClick={() => onRemove(skill.id)} 
        className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md p-0.5 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove skill"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Skills;
