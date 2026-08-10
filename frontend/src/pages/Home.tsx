import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../App';
import Navbar from '../components/Navbar';
import MealCard from '../components/MealCard';
import MealDetailsModal from '../components/MealDetailsModal';
import MealFilters from '../components/MealFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProfile } from '../services/profile';
import { getMeals, getMealDetails } from '../services/meals';
import {
  getSavedMeals,
  saveMeal,
  deleteSavedMeal,
} from '../services/savedMeals';

interface HomeProps {
  user: User | null;
  error: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Meal {
  id: number;
  title: string;
  image: string;
}

const Home = ({ user, error, setUser }: HomeProps) => {
  const navigate = useNavigate();

  // States
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const [calories, setCalories] = useState<{
    maintenanceCalories: number;
    targetCalories: number;
  } | null>(null);

  const [loadingMeals, setLoadingMeals] = useState(false);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);

  const [filters, setFilters] = useState({
    sort: 'popularity',
    diet: '',
    mealType: '',
    minCalories: undefined,
    maxCalories: undefined,
  });

  const [savedMeals, setSavedMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setProfileComplete(data.profileComplete);

        if (data.profileComplete) {
          setCalories(data.calories);

          const savedMealsData = await getSavedMeals();
          setSavedMeals(savedMealsData.meals);

          setLoadingMeals(true);

          const mealsData = await getMeals({ sort: filters.sort });
          setMeals(mealsData.meals);

          setLoadingMeals(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoadingMeals(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, filters.sort]);

  const handleMealClick = async (id: number) => {
    try {
      const mealDetails = await getMealDetails(id);
      setSelectedMeal(mealDetails.meal);
    } catch (err) {
      console.error('Error fetching meal details: ', err);
    }
  };

  const buildSavedMeal = (meal: any) => {
    const getNutrient = (name: string) =>
      meal.nutrition.nutrients.find((n: any) => n.name === name)?.amount;

    return {
      meal_id: meal.id,
      title: meal.title,
      image: meal.image,

      cuisines: meal.cuisines,
      dishTypes: meal.dishTypes,
      diets: meal.diets,

      vegetarian: meal.vegetarian,
      vegan: meal.vegan,
      glutenFree: meal.glutenFree,
      dairyFree: meal.dairyFree,

      readyInMinutes: meal.readyInMinutes,
      servings: meal.servings,

      calories: getNutrient('Calories'),
      protein: getNutrient('Protein'),
      carbs: getNutrient('Carbohydrates'),
      fat: getNutrient('Fat'),

      ingredients: meal.extendedIngredients.map(
        (ingredient: any) => ingredient.name,
      ),
    };
  };

  const handleSaveMeal = async () => {
    if (!selectedMeal) return;

    try {
      const mealToSave = buildSavedMeal(selectedMeal);

      await saveMeal(mealToSave);

      setSavedMeals((prev) => [...prev, mealToSave]);
    } catch (err) {
      console.error('Error saving meal:', err);
    }
  };

  const handleUnsaveMeal = async () => {
    if (!selectedMeal) return;

    try {
      await deleteSavedMeal(selectedMeal.id);

      setSavedMeals((prev) =>
        prev.filter((meal) => meal.meal_id !== selectedMeal.id),
      );
    } catch (err) {
      console.error('Error removing meal:', err);
    }
  };

  const handleApplyFilters = async () => {
    setLoadingMeals(true);

    try {
      const mealsData = await getMeals(filters);
      setMeals(mealsData.meals);
    } catch (err) {
      console.error('Error applying filters: ', err);
    } finally {
      setLoadingMeals(false);
    }
  };

  const handleClearFilters = async () => {
    const defaultFilters = {
      sort: 'popularity',
      diet: '',
      mealType: '',
      minCalories: undefined,
      maxCalories: undefined,
    };

    setFilters(defaultFilters);
    setLoadingMeals(true);

    try {
      const mealsData = await getMeals(defaultFilters);
      setMeals(mealsData.meals);
    } catch (err) {
      console.error('Error clearing filters:', err);
    } finally {
      setLoadingMeals(false);
    }
  };

  // If the user is not logged in, redirect to the login page
  if (!user) return null;

  if (profileComplete === null) {
    return (
      <>
        <Navbar user={user} setUser={setUser} />
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  const isSaved = savedMeals.some((meal) => meal.meal_id === selectedMeal?.id);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {error && (
            <p className="mb-6 rounded-lg bg-red-50 p-3 text-red-600">
              {error}
            </p>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.first_name} {user.last_name}!
            </h1>

            <p className="mt-2 text-gray-600">
              Find personalised meal recommendations based on your profile and
              saved meals.
            </p>
          </div>

          {!profileComplete ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-gray-700">
                Complete your profile to receive recommendations.
              </p>

              <button
                onClick={() => navigate('/profile')}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Complete Profile
              </button>
            </div>
          ) : (
            <>
              {/* Calories */}
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Maintenance Calories</p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {calories?.maintenanceCalories}
                  </h2>

                  <p className="text-sm text-gray-500">kcal/day</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Target Calories</p>

                  <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                    {calories?.targetCalories}
                  </h2>

                  <p className="text-sm text-gray-500">kcal/day</p>
                </div>
              </div>

              {/* Filters + Meals */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-lg font-semibold text-gray-900">
                    Filters
                  </h2>

                  <MealFilters
                    filters={filters}
                    setFilters={setFilters}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                  />
                </div>

                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Recommended Meals
                    </h2>

                    <p className="text-sm text-gray-500">
                      {meals.length} meals
                    </p>
                  </div>

                  {loadingMeals ? (
                    <div className="flex min-h-64 items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {meals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          id={meal.id}
                          title={meal.title}
                          image={meal.image}
                          onClick={handleMealClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isSaved={isSaved}
          onSave={handleSaveMeal}
          onUnsave={handleUnsaveMeal}
        />
      )}
    </>
  );
};

export default Home;
