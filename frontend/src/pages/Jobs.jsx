import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import SkeletonJobCard from '../components/SkeletonJobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // New State for search

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`);
        setJobs(response.data.data || response.data.jobs || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch jobs from server');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on title or company name
  const filteredJobs = jobs.filter((job) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Find your next <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">dream job</span>
        </h1>
        
        {/* Search Bar */}
        <div className="relative mt-6">
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-6 focus:outline-none focus:border-blue-500 transition-all shadow-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonJobCard key={i} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center bg-slate-900 border border-slate-800 rounded-xl p-12 mt-8">
          <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
          <p className="text-slate-400">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;