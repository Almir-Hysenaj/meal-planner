import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { User } from '../App';
import { getProfile, createProfile, updateProfile } from '../services/profile';

interface ProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile = ({ user, setUser }: ProfileProps) => {
  const navigate = useNavigate();

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    goal: '',
    goal_rate: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data.profileComplete) {
          setProfileExists(true);
          setFormData({
            age: String(data.profile.age),
            sex: data.profile.sex,
            height_cm: String(data.profile.height_cm),
            weight_kg: String(data.profile.weight_kg),
            activity_level: data.profile.activity_level,
            goal: data.profile.goal,
            goal_rate: String(Number(data.profile.goal_rate)),
          });
        }
      } catch (err) {
        console.log('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const profileData = {
        age: Number(formData.age),
        sex: formData.sex,
        height_cm: Number(formData.height_cm),
        weight_kg: Number(formData.weight_kg),
        activity_level: formData.activity_level,
        goal: formData.goal,
        goal_rate: Number(formData.goal_rate),
      };

      if (profileExists) {
        await updateProfile(profileData);
      } else {
        await createProfile(profileData);
      }

      navigate('/');
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </h2>

          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            type="number"
            placeholder="Height in cm"
            value={formData.height_cm}
            onChange={(e) =>
              setFormData({ ...formData, height_cm: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Weight in kg"
            value={formData.weight_kg}
            onChange={(e) =>
              setFormData({ ...formData, weight_kg: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />

          <select
            value={formData.activity_level}
            onChange={(e) =>
              setFormData({ ...formData, activity_level: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>

          <select
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select goal</option>
            <option value="maintain">Maintain weight</option>
            <option value="lose">Lose weight</option>
            <option value="gain">Gain weight</option>
          </select>

          <select
            value={formData.goal_rate}
            onChange={(e) =>
              setFormData({ ...formData, goal_rate: e.target.value })
            }
            className="w-full mb-6 p-2 border rounded"
          >
            <option value="">Select goal rate</option>
            <option value="0">Maintain</option>
            <option value="0.25">0.25kg/week</option>
            <option value="0.5">0.5kg/week</option>
            <option value="1">1kg/week</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
