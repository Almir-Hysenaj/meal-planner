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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">Meal Planner</h1>
        </div>

        {/* Login card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>

            <p className="mt-1 text-sm text-gray-500">
              Log in to continue to your meal recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 active:scale-[0.99] cursor-pointer"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Register */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Don't have an account?</p>

            <Link
              to="/register"
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
