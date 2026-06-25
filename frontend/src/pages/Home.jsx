import { Link } from 'react-router-dom';
import { useContext } from 'react'; // 1. Import useContext
import { AuthContext } from '../context/AuthContext'; // 2. Import your AuthContext

const Home = () => {
  const { user } = useContext(AuthContext); // 3. Get the user object

  return (
    <div className="min-h-[85vh] flex items-center bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Find your next <br />
              <span className="text-blue-500">dream job</span> today.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Connect with top employers and discover opportunities that perfectly match your skills, passion, and career goals.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              {/* 4. Conditional Rendering based on user role */}
              {user ? (
                // If logged in as Recruiter, show Dashboard button, otherwise show Browse Jobs
                <Link 
                  to={user.role === 'recruiter' ? '/recruiter-dashboard' : '/jobs'} 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25 text-center"
                >
                  {user.role === 'recruiter' ? 'Go to Dashboard' : 'Browse Jobs'}
                </Link>
              ) : (
                // If NOT logged in, show default Browse Jobs
                <Link 
                  to="/jobs" 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25 text-center"
                >
                  Browse Jobs
                </Link>
              )}
            </div>
            
            {/* ... (rest of your stats code) ... */}
          </div>

          {/* ... (rest of your image code) ... */}
        </div>
      </div>
    </div>
  );
};

export default Home;