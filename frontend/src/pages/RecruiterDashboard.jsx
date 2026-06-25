import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPostedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/me', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        setMyJobs(response.data.data || response.data.jobs || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load your job postings');
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchMyPostedJobs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalJobs = myJobs.length;
  // If your backend returns an applicants array, this will count them. Otherwise, it defaults to 0.
  const totalApplicants = myJobs.reduce((total, job) => total + (job.applicants?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* ---> HEADER <--- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
          <p className="text-slate-400">Overview of your hiring pipeline and job postings.</p>
        </div>
        <Link 
          to="/create-job" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          + Post New Job
        </Link>
      </div>

      {/* ---> STATS SECTION <--- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Active Jobs</h3>
          <p className="text-4xl font-bold text-blue-500">{totalJobs}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Applicants</h3>
          <p className="text-4xl font-bold text-green-500">{totalApplicants}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Interviews Scheduled</h3>
          <p className="text-4xl font-bold text-purple-500">0</p>
        </div>
      </div>

      {/* ---> MANAGE JOBS TABLE <--- */}
      <h2 className="text-xl font-bold text-white mb-4">Manage Jobs</h2>
      
      {myJobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <h3 className="text-xl font-bold text-white mb-2">No jobs posted yet</h3>
          <p className="text-slate-400 mb-6">You haven't created any job listings. Post one to start receiving applications!</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-sm text-slate-400">
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Posted On</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {myJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-white font-medium">{job.title}</td>
                    <td className="p-4 text-slate-300">{job.location}</td>
                    <td className="p-4">
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                        {job.jobType || 'Full-time'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                      >
                        View Job
                      </Link>
                      
                      <Link 
                        to={`/jobs/${job._id}/applicants`}
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                      >
                        View Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;