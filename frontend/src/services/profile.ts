import axios from 'axios';

export const getProfile = async () => {
  const res = await axios.get('/api/profile', { withCredentials: true });
  return res.data;
};

export const createProfile = async (profileData: object) => {
  const res = await axios.post('/api/profile', profileData, {
    withCredentials: true,
  });
  return res.data;
};

export const updateProfile = async (profileData: object) => {
  const res = await axios.put('/api/profile', profileData, {
    withCredentials: true,
  });
  return res.data;
};
