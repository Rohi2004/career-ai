import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, CheckSquare, Activity, 
  PlusCircle, Edit, Trash2, MoreVertical, 
  MapPin, Clock, Search, Loader2, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/jobs', user?.token);
      if (response.success) {
        setJobs(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch jobs.');
      }
    } catch (err) {
      setError('An error occurred while fetching jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchJobs();
    }
  }, [user]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await api.delete(`/jobs/${jobId}`, user?.token);
        if (response.success) {
          setJobs(jobs.filter(job => job._id !== jobId));
        } else {
          alert(response.message || 'Failed to delete job');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred while deleting the job.');
      }
    }
  };

  const filteredJobs = jobs.filter(job => 
    !searchQuery || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeJobsCount = jobs.filter(job => job.status !== 'Closed').length;

  const stats = [
    { title: 'Total Jobs', value: jobs.length, icon: <Briefcase size={24} className="text-indigo-600" />, trend: 'All time' },
    { title: 'Active Jobs', value: activeJobsCount, icon: <Activity size={24} className="text-green-600" />, trend: 'Currently open' },
    { title: 'Total Applications', value: '-', icon: <CheckSquare size={24} className="text-blue-600" />, trend: 'Coming soon' },
    { title: 'Registered Users', value: '-', icon: <Users size={24} className="text-purple-600" />, trend: 'Coming soon' }
  ];

  if (isLoading && jobs.length === 0) {
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
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Admin Dashboard</h1>
            <p className="text-text-secondary text-sm">Overview of platform metrics and recent activity.</p>
          </div>
          <Link to="/admin/jobs/new" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors">
            <PlusCircle size={18} /> Add New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-text-primary mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-text-secondary mb-2">{stat.title}</p>
                <p className="text-xs font-medium text-slate-400">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Jobs Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Job Listings</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {error ? (
              <div className="p-6 text-center text-red-500 flex items-center justify-center gap-2">
                <AlertCircle size={20} /> {error}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No jobs found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Applications</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-text-primary mb-1">{job.title}</span>
                          <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                            <span className="flex items-center gap-1"><Briefcase size={12}/> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                            <span className="flex items-center gap-1 text-slate-400"><Clock size={12}/> {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          job.status !== 'Closed' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {job.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-text-primary bg-slate-100 px-3 py-1 rounded-lg">-</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/jobs/${job._id}/edit`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-100 flex justify-center">
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              View All Jobs
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
