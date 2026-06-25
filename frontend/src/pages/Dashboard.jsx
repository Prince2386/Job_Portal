import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        // ---> CHANGED: Added '/me' to the end of the URL! <---
        const response = await axios.get('http://localhost:5000/api/applications/me', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        setApplications(response.data.data || response.data.applications || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load your applications');
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchMyApplications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8">Track your job applications and statuses.</p>

      {applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
          <p className="text-slate-400 mb-6">You haven't applied to any jobs yet. Start exploring!</p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-sm text-slate-400">
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Applied On</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-white font-medium">
                      {/* Assuming your backend populates the job data */}
                      {app.job?.title || 'Unknown Job'}
                    </td>
                    <td className="p-4 text-slate-300">
                      {app.job?.companyName || 'Unknown Company'}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/20">
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {app.resume ? (
                        <a 
                          href={app.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-slate-500 text-sm">No file</span>
                      )}
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

export default Dashboard;