import { Avatar } from '../UI/Avatar';

export const ProfileView = ({ profile, onEdit }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={profile.avatar} size="lg" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-indigo-400">@{profile.username}</p>
        </div>
      </div>
      
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">О себе</h3>
          <p className="text-gray-300">{profile.bio}</p>
        </div>
      )}

      <button
        onClick={onEdit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
      >
        Редактировать профиль
      </button>
    </div>
  );
};
