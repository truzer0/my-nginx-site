export const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-semibold text-white mb-4">Активность</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-700">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">
              <span className="text-indigo-400 text-sm">{getActivityIcon(activity.type)}</span>
            </div>
            <div>
              <p className="text-white">{activity.description}</p>
              <p className="text-gray-400 text-sm">{new Date(activity.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getActivityIcon(type) {
  const icons = {
    login: '🔒',
    update: '✏️',
    task: '✅'
  };
  return icons[type] || '⚡';
}
