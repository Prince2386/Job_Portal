// 1. Removed BrowserRouter from the import
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import Profile from './pages/Profile';

import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Candidates from './pages/Candidates';
import CompanyProfile from './pages/CompanyProfile';

function App() {
  return (
    // 2. Removed the <Router> wrapper here
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Candidate Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Recruiter Routes */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
      </Routes>
    </div>
  );
}

export default App;