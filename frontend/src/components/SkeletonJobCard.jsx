const SkeletonJobCard = () => {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 w-full">
            <div className="h-6 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
        </div>
        <div className="h-10 bg-slate-800 rounded-lg w-full"></div>
      </div>
    );
  };
  
  export default SkeletonJobCard;