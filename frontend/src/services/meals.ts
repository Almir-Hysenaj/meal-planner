import axios from 'axios';

export const getMeals = async () => {
  const res = await axios.get('/api/meals');
  return res.data;
};
