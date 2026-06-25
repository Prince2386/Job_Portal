import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
          <p className="text-slate-400 text-sm">{job.companyName}</p>
        </div>
        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
          {job.jobType || 'Full-time'}
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-slate-300 text-sm">
          <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {job.location}
        </div>
        <div className="flex items-center text-slate-300 text-sm">
          <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ${job.salary?.toLocaleString() || 'Negotiable'}
        </div>
      </div>

      {/* This link will eventually take us to the specific Job Details page */}
      <Link 
        to={`/jobs/${job._id}`} 
        className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;