import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import type { User } from '../App';

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Navbar = ({ user, setUser }: NavbarProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-emerald-700 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold hover:text-emerald-100 transition"
        >
          Meal Planner
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/profile"
                className="rounded-lg px-3 py-2 hover:bg-emerald-600 transition"
              >
                Profile
              </Link>

              <Link
                to="/saved"
                className="rounded-lg px-3 py-2 hover:bg-emerald-600 transition"
              >
                Saved Meals
              </Link>

              <button
                onClick={handleLogout}
                className="
                  rounded-lg
                  bg-white
                  px-3
                  py-2
                  text-emerald-700
                  hover:bg-gray-100
                  transition
                  cursor-pointer
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 hover:bg-emerald-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-white
                  px-3
                  py-2
                  text-emerald-700
                  hover:bg-gray-100
                  transition
                "
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden rounded-lg p-2 hover:bg-emerald-600"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="
          md:hidden
          border-t
          border-emerald-600
          bg-emerald-700
          px-4
          pb-4
        "
        >
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-emerald-600"
              >
                Profile
              </Link>

              <Link
                to="/saved"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-emerald-600"
              >
                Saved Meals
              </Link>

              <button
                onClick={handleLogout}
                className="
                  rounded-lg
                  bg-white
                  px-3
                  py-2
                  text-left
                  text-emerald-700
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-emerald-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-white px-3 py-2 text-emerald-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
