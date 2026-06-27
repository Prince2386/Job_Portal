import { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const ApplyModal = ({ isOpen, onClose, jobId }) => {
  const { user } = useContext(AuthContext);
  
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null); // State for the actual file
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the modal isn't supposed to be open, render nothing!
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    // We grab the first file the user selected
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      return toast.error('Please upload your resume PDF');
    }

    setIsSubmitting(true);

    // CRITICAL: We cannot send files as normal JSON. We MUST use FormData.
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('coverLetter', coverLetter);

    try {
      // Send the FormData to our backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/apply/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Application submitted successfully!');
      onClose(); // Close the modal
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false); // Turn off the loading state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
        
        {/* Close Button (X in the top right) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Apply for this Role</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Resume Upload Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Resume (PDF only)
            </label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              required
              className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 transition-all cursor-pointer border border-slate-700 rounded-lg p-2 bg-slate-950"
            />
          </div>

          {/* Cover Letter Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea 
              rows="4"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Tell the recruiter why you're a great fit..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg flex justify-center items-center"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Uploading securely...</span>
            ) : (
              'Submit Application'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ApplyModal;