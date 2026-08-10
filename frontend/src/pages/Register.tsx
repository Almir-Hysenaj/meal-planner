import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface RegisterProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Tailwind classes
const inputClass = 'border p-2 w-full mb-3 rounded-xl border-slate-700/70';

const Register = ({ setUser }: RegisterProps) => {
  // States to hold the form data and error messages
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // What happens when the user submits the registration form
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      setUser(res.data.user);
      navigate('/');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">Meal Planner</h1>
        </div>

        {/* Registration card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* First name */}
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  First name
                </label>

                <input
                  id="first_name"
                  type="text"
                  placeholder="First name"
                  className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>

                <input
                  id="last_name"
                  type="text"
                  placeholder="Last name"
                  className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            {/* Password */}
            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className={`${inputClass} w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100`}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Register button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 active:scale-[0.99] cursor-pointer"
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Login */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Already have an account?</p>

            <Link
              to="/login"
              className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
