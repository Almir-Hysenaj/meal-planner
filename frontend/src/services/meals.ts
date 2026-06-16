import axios from 'axios';

interface GetMealFilters {
  sort?: string;
  diet?: string;
  mealType?: string;
  minCalories?: number;
  maxCalories?: number;
}

export const getMeals = async (filters: GetMealFilters = {}) => {
  const res = await axios.get('/api/meals', {
    params: filters,
  });
  return res.data;
};

export const getMealDetails = async (id: number) => {
  const res = await axios.get(`/api/meals/${id}`);
  return res.data;
};
