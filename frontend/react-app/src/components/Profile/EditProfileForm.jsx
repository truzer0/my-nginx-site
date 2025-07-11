import { useState } from 'react';
import { Avatar } from '../UI/Avatar';

export const EditProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio || '',
    avatar: profile.avatar
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <Avatar src={formData.avatar} size="lg" editable />
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Имя</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Фамилия</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-1">О себе</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          className="w-full bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg px-4 py-2 text-white min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
};
