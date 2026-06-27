import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New state to toggle between viewing and editing
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        const userData = response.data.data || response.data.user || response.data;
        
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          skills: userData.skills ? userData.skills.join(', ') : ''
        });
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');

      await axios.put('http://localhost:5000/api/auth/profile', 
        {
          name: formData.name,
          bio: formData.bio,
          skills: skillsArray
        }, 
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      
      toast.success('Profile updated successfully!');
      setIsEditing(false); // Switch back to view mode after saving!
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Function to cancel editing and reset changes (optional but good UX)
  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">My Profile</h2>
            <p className="text-slate-400">Manage your personal information.</p>
          </div>
          
          {/* Show Edit button only if we are NOT currently editing */}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {/* ========================================= */}
        {/* EDIT MODE                 */}
        {/* ========================================= */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address (Locked)</label>
                <input 
                  type="email" name="email" value={formData.email} disabled
                  className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-lg px-4 py-2.5 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
              <input 
                type="text" name="skills" value={formData.skills} onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Professional Bio</label>
              <textarea 
                name="bio" value={formData.bio} onChange={handleChange} rows="4"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Tell recruiters a little bit about yourself..."
              ></textarea>
            </div>

            <div className="flex space-x-4 pt-4">
              <button 
                type="submit" disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" onClick={handleCancel} disabled={saving}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* ========================================= */
          /* VIEW MODE                 */
          /* ========================================= */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Full Name</h3>
                <p className="text-lg text-white font-semibold">{formData.name || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Email Address</h3>
                <p className="text-lg text-white">{formData.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Skills</h3>
              {formData.skills ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, index) => (
                    <span key={index} className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No skills added yet.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Professional Bio</h3>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {formData.bio || <span className="text-slate-500 italic">No bio provided. Click edit to add one!</span>}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;