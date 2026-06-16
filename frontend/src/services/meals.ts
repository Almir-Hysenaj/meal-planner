import axios from 'axios';

export const getMeals = async () => {
  const res = await axios.get('/api/meals');
  return res.data;
};

export const getMealDetails = async (id: number) => {
  const res = await axios.get(`/api/meals/${id}`);
  return res.data;
};
