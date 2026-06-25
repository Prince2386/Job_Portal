import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Shared Tailwind classes for the links to keep the code clean
  const linkClass = "text-slate-300 hover:text-white transition-colors text-sm font-medium";

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ---> LOGO (Always visible) <--- */}
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white">
              Job<span className="text-blue-500">Portal</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">

            {/* Dynamic UI: Check if user is logged in */}
            {user ? (
              <>
                {/* ========================================== */}
                {/* ---> RECRUITER NAVIGATION MENU <---        */}
                {/* ========================================== */}
                {user.role?.toLowerCase() === 'recruiter' && (
                  <div className="flex items-center space-x-6">
                    <Link to="/recruiter-dashboard" className={linkClass}>Dashboard</Link>
                    <Link to="/create-job" className={linkClass}>Post Job</Link>
                    <Link to="/candidates" className={linkClass}>Candidates</Link>
                    <Link to="/analytics" className={linkClass}>Analytics</Link>
                    <Link to="/company-profile" className={linkClass}>Company Profile</Link>
                  </div>
                )}

                {/* ========================================== */}
                {/* ---> CANDIDATE NAVIGATION MENU <---        */}
                {/* ========================================== */}
                {user.role?.toLowerCase() === 'candidate' && (
                  <div className="flex items-center space-x-6">
                    <Link to="/" className={linkClass}>Home</Link>
                    <Link to="/jobs" className={linkClass}>Jobs</Link>
                    <Link to="/dashboard" className={linkClass}>Applications</Link>
                    <Link to="/profile" className={linkClass}>Profile</Link>
                    <Link to="/notifications" className={linkClass}>Notifications</Link>
                  </div>
                )}

                {/* ---> LOGOUT BUTTON (For all logged-in users) <--- */}
                <div className="border-l border-slate-700 pl-6 ml-2">
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* ========================================== */
              /* ---> LOGGED OUT NAVIGATION MENU <---       */
              /* ========================================== */
              <div className="flex items-center space-x-4 border-l border-slate-700 pl-6">
                <Link to="/login" className={linkClass}>
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;