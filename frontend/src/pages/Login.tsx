import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface LoginForm {
  email: string;
  password: string;
}

// Tailwind classes
const inputClass = 'border p-2 w-full mb-3 rounded-xl border-slate-700/70';
const buttonClass =
  'p-2 w-full rounded-2xl border border-slate-700 transform transition-transform duration-200 hover:cursor-pointer hover:scale-102 hover:font-bold';

const Login = ({ setUser }: LoginProps) => {
  // State to hold the form data and error messages
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  // What happens when the user submits the login form
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post<{ user: User }>('/api/auth/login', form);

      setUser(res.data.user);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  // Update form state when the user types in the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-15">
      <h1 className="text-4xl mb-3 font-bold text-center text-slate-800">
        Meal Planner
      </h1>
      <div className="w-full h-0.5 bg-gray-300/75 my-4 rounded"></div>

      <div className="px-6 py-7 w-full max-w-xl">
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-5 font-medium text-center text-slate-700">
            Log in
          </h2>

          <p className="text-xs text-gray-500 mb-1">Email Address</p>
          <input
            type="email"
            name="email"
            className={inputClass}
            value={form.email}
            onChange={handleChange}
          />

          <p className="text-xs text-gray-500 mb-1">Password</p>
          <input
            type="password"
            name="password"
            className={inputClass}
            value={form.password}
            onChange={handleChange}
          />

          <button
            className={`${buttonClass} bg-slate-700 text-white mt-5 mb-2`}
          >
            Log in
          </button>

          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        </form>

        <div className="w-full h-1 bg-gray-300/50 my-4 rounded"></div>

        {/* Registration link */}
        <h3 className="font-medium text-md mb-1 text-center text-slate-700">
          Don't have an account?
        </h3>
        <Link to="/register">
          <button className={`${buttonClass} bg-white text-slate-700 my-2`}>
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
