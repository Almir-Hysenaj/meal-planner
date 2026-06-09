import { useNavigate } from 'react-router-dom';
import type { User } from '../App';
import Navbar from '../components/Navbar';

interface HomeProps {
  user: User | null;
  error: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Home = ({ user, error, setUser }: HomeProps) => {
  // If the user is not logged in, redirect to the login page
  const navigate = useNavigate();
  if (!user) return navigate('/login');

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
