import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MessageModal from '../components/MessageToast';
import type { User } from '../App';
import { getProfile, createProfile, updateProfile } from '../services/profile';

interface ProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Profile = ({ user, setUser }: ProfileProps) => {
  const navigate = useNavigate();

  // States
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    goal: '',
    goal_rate: '',
  });

  // Sets the form data to users already existing profile (if exists)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data.profileComplete) {
          // Set profile exists to true
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
        setMessageModal({
          type: 'error',
          message: 'Failed to fetch profile. Please try again.',
        });
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

  // Handles user pressing submit button (updating/creating profile)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Create object containing current form data
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

      setMessageModal({
        type: 'success',
        message: profileExists
          ? 'Profile updated successfully.'
          : 'Profile created successfully.',
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Error saving profile:', err);

      setMessageModal({
        type: 'error',
        message: 'Failed to save profile. Please try again.',
      });
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 pt-25">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {profileExists ? 'Update Profile' : 'Create Profile'}
            </h1>

            <p className="mt-2 text-gray-500">
              Tell us about yourself so we can personalise your meal
              recommendations.
            </p>
          </div>

          {/* Profile form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
          >
            {/* Basic information */}
            <div className="mb-8">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                About You
              </h2>

              <p className="mb-5 text-sm text-gray-500">
                Enter your basic information.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Age
                  </label>

                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sex
                  </label>

                  <select
                    value={formData.sex}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sex: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Height */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Height
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 175"
                      value={formData.height_cm}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          height_cm: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-12 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      cm
                    </span>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Weight
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      value={formData.weight_kg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weight_kg: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-12 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="mb-8 border-t border-gray-100 pt-8">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                Lifestyle & Goals
              </h2>

              <p className="mb-5 text-sm text-gray-500">
                This information helps calculate your calorie targets.
              </p>

              {/* Activity level */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Activity level
                </label>

                <select
                  value={formData.activity_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activity_level: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select activity level</option>
                  <option value="not_active">Not Very Active</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              {/* Goal */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Goal
                </label>

                <select
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal: e.target.value,
                      goal_rate:
                        e.target.value === 'maintain'
                          ? '0'
                          : formData.goal_rate,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select goal</option>
                  <option value="maintain">Maintain weight</option>
                  <option value="lose">Lose weight</option>
                  <option value="gain">Gain weight</option>
                </select>
              </div>

              {/* Goal rate */}
              {formData.goal !== 'maintain' && formData.goal !== '' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Weekly goal
                  </label>

                  <select
                    value={formData.goal_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        goal_rate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select goal rate</option>
                    <option value="0.25">0.25 kg/week</option>
                    <option value="0.5">0.5 kg/week</option>
                    <option value="1">1 kg/week</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 active:scale-[0.99] cursor-pointer"
            >
              {profileExists ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>

      {messageModal && (
        <MessageModal
          type={messageModal.type}
          message={messageModal.message}
          onClose={() => setMessageModal(null)}
        />
      )}
    </>
  );
};

export default Profile;
