import { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../../services/profileService';
import { ProfileView, EditProfileForm, Achievements, ActivityFeed } from '../../components/Profile';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile('current');
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const updatedProfile = await updateProfile('current', updatedData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!profile) return <div>Ошибка загрузки профиля</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {isEditing ? (
            <EditProfileForm 
              profile={profile}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView 
              profile={profile} 
              onEdit={() => setIsEditing(true)} 
            />
          )}
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Achievements achievements={profile.achievements} />
          <ActivityFeed activities={profile.activities} />
        </div>
      </div>
    </div>
  );
};
