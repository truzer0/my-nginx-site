export const Achievements = ({ achievements }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-4">Достижения</h3>
      <div className="space-y-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{ach.title}</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full" 
                  style={{ width: `${ach.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
