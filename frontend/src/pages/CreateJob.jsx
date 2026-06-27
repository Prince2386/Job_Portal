import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const CreateJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '', // CHANGED: Matched backend schema perfectly
    location: '',
    salary: '',
    jobType: 'Full-time',
    description: '',
    requirements: '', // ADDED: Now we have a spot for requirements!
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // The backend expects requirements as an Array, so we split the string by commas!
      const dataToSend = {
        ...formData,
        requirements: formData.requirements.split(',').map(item => item.trim()),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      toast.success('Job posted successfully!');
      navigate('/'); 
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Post a New Job</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Job Title</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Senior React Developer"
              />
            </div>

            <div>
              {/* CHANGED NAME ATTRIBUTE TO 'company' */}
              <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
              <input 
                type="text" name="company" value={formData.company} onChange={handleChange} required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. TechCorp Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange} required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Remote, New York, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Salary</label>
              <input 
                type="text" name="salary" value={formData.salary} onChange={handleChange} required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. ₹50,000 - ₹70,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Job Type</label>
            <select 
              name="jobType" value={formData.jobType} onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* NEW FIELD: REQUIREMENTS */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Requirements (Comma separated)</label>
            <input 
              type="text" name="requirements" value={formData.requirements} onChange={handleChange} required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. React, Node.js, 3+ years experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Job Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required rows="5"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              placeholder="Describe the role..."
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg mt-4 transition-all">
            Publish Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;