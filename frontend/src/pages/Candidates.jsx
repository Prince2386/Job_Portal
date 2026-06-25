const Candidates = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">Candidates</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th className="p-4 text-slate-400">Name</th>
              <th className="p-4 text-slate-400">Applied For</th>
              <th className="p-4 text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="text-white">
            <tr>
              <td className="p-4">John Doe</td>
              <td className="p-4">Frontend Developer</td>
              <td className="p-4 text-emerald-400">Shortlisted</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Candidates;