import axios from 'axios';

export const getSavedMeals = async () => {
  const res = await axios.get('/api/savedMeals');
  return res.data;
};

export const saveMeal = async (meal: {
  meal_id: number;
  title: string;
  image: string;
}) => {
  const res = await axios.post('/api/savedMeals', meal);
  return res.data;
};

export const deleteSavedMeal = async (mealId: number) => {
  const res = await axios.delete(`/api/savedMeals/${mealId}`);
  return res.data;
};
