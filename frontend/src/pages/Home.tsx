import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { User } from '../App';
import Navbar from '../components/Navbar';
import MealCard from '../components/MealCard';
import MealDetailsModal from '../components/MealDetailsModal';
import MealFilters from '../components/MealFilters';
import { getProfile } from '../services/profile';
import { getMeals, getMealDetails } from '../services/meals';

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
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    sort: 'popularity',
    diet: '',
    mealType: '',
    minCalories: undefined,
    maxCalories: undefined,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfileComplete(data.profileComplete);

        if (data.profileComplete) {
          setCalories(data.calories);
          const mealsData = await getMeals({ sort: filters.sort });
          setMeals(mealsData.meals);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
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

  const handleApplyFilters = async () => {
    try {
      const mealsData = await getMeals(filters);
      setMeals(mealsData.meals);
    } catch (err) {
      console.error('Error applying filters: ', err);
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

    try {
      const mealsData = await getMeals(defaultFilters);
      setMeals(mealsData.meals);
    } catch (err) {
      console.error('Error clearing filters:', err);
    }
  };

  // If the user is not logged in, redirect to the login page
  if (!user) return <Navigate to="/login" />;

  if (profileComplete === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome, {user.first_name} {user.last_name}!
            </h2>

            {!profileComplete ? (
              <div>
                <p>Complete your profile to receive recommendations.</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Complete Profile
                </button>
              </div>
            ) : (
              <div>
                <h2>Maintenance Kcals: {calories?.maintenanceCalories}</h2>
                <h2>Target Kcals: {calories?.targetCalories}</h2>
                <MealFilters
                  filters={filters}
                  setFilters={setFilters}
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </>
  );
};

export default Home;
