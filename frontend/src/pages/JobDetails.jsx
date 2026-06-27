import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
        setJob(response.data.data || response.data.job || response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch job details');
        setLoading(false);
      }
    };
    // ... rest of your code

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center text-white mt-10">Job not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Jobs
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
            <p className="text-xl text-slate-400">{job.companyName}</p>
          </div>

          <div className="mt-4 md:mt-0">
            {/* Conditional Apply Button and Modal */}
            {user ? (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
                >
                  Apply Now
                </button>

                {/* The Modal Component (hidden unless isModalOpen is true) */}
                <ApplyModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  jobId={job._id}
                />
              </>
            ) : (
              <Link to="/login" className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700">
                Login to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-slate-800">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Location</h3>
            <p className="text-white">{job.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Job Type</h3>
            <p className="text-white">{job.jobType || 'Full-time'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Salary</h3>
            <p className="text-white">${job.salary?.toLocaleString() || 'Negotiable'}</p>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;