const Analytics = () => {
  const stats = [
    { label: "Total Views", value: "1,240" },
    { label: "Applications", value: "86" },
    { label: "Conversion Rate", value: "6.9%" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Hiring Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
            <h3 className="text-slate-400 mb-2">{stat.label}</h3>
            <p className="text-4xl font-bold text-blue-500">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Analytics;