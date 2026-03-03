import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface LoginForm {
  email: string;
  password: string;
}

const Login = ({ setUser }: LoginProps) => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="email"
          className="border p-2 w-full mb-3"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-2 w-full mb-3"
          value={form.password}
          onChange={handleChange}
        />

        <button className="bg-blue-500 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
