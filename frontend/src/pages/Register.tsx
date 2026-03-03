import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface RegisterProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Register = ({ setUser }: RegisterProps) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">
          Register
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="firstname"
          className="border p-2 w-full mb-3"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="lastname"
          className="border p-2 w-full mb-3"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-2 w-full mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 w-full mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-500 text-white p-2 w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
