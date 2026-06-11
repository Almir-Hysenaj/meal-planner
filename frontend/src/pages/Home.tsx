import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { User } from '../App';
import Navbar from '../components/Navbar';
import { getProfile } from '../services/profile';

interface HomeProps {
  user: User | null;
  error: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Home = ({ user, error, setUser }: HomeProps) => {
  const navigate = useNavigate();

  // States
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [calories, setCalories] = useState<{
    maintenanceCalories: number;
    targetCalories: number;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileComplete(data.profileComplete);

        if (data.profileComplete) {
          setCalories(data.calories);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // If the user is not logged in, redirect to the login page
  if (!user) return <Navigate to="/login" />;

  if (profileComplete === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome, {user.first_name} {user.last_name}!
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>

            {!profileComplete ? (
              <div>
                <p>Complete your profile to receive recommendations.</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Complete Profile
                </button>
              </div>
            ) : (
              <div>
                <h2>Maintenance Kcals: {calories?.maintenanceCalories}</h2>
                <h2>Target Kcals: {calories?.targetCalories}</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
