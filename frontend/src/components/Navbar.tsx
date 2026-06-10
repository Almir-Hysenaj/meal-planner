import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../App';

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Navbar = ({ user, setUser }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold">
          Meal Planner
        </Link>
        <div>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="ml-2 px-3 py-1 bg-none text-white rounded cursor-pointer"
              >
                Profile
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mx-2">
                Login
              </Link>
              <Link to="/register" className="mx-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
