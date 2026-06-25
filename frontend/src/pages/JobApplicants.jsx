import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const JobApplicants = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/job/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        setApplications(response.data.data || response.data.applications || []);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load applicants');
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchApplicants();
    }
  }, [id, user]);

  // ---> NEW FUNCTION: Update the candidate's status <---
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      // Note: Adjust this URL if your backend update route is different!
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, 
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      
      toast.success(`Applicant marked as ${newStatus}`);
      
      // Update the UI instantly without reloading the page
      setApplications(prevApps => 
        prevApps.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Link to="/recruiter-dashboard" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Applicant Viewer</h1>
        <p className="text-slate-400">Review candidates and update their application status.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <h3 className="text-xl font-bold text-white mb-2">No applicants yet</h3>
          <p className="text-slate-400">Sit tight! Candidates haven't discovered this job yet.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-sm text-slate-400">
                  <th className="p-4 font-medium">Candidate Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Applied On</th>
                  <th className="p-4 font-medium">Resume</th>
                  <th className="p-4 font-medium text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-white font-medium">
                      {app.applicant?.name || 'Unknown Candidate'}
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      {app.applicant?.email || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {/* CHANGED: We now ask for app.resumeLink! */}
                      {app.resumeLink ? (
                        <a 
                          href={app.resumeLink} /* CHANGED: Make sure the href also points to resumeLink */
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          View PDF
                        </a>
                      ) : (
                        <span className="text-slate-500 text-sm">No file</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {/* ---> THE NEW STATUS DROPDOWN <--- */}
                      <select 
                        value={app.status || 'Pending'}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
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

export default JobApplicants;