import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MealCard from '../components/MealCard';
import MealDetailsModal from '../components/MealDetailsModal';
import { getSavedMeals, deleteSavedMeal } from '../services/savedMeals';
import { getMealDetails } from '../services/meals';
import type { User } from '../App';

interface SavedMealsProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface Meal {
  meal_id: number;
  title: string;
  image: string;
}

const SavedMeals = ({ user, setUser }: SavedMealsProps) => {
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);

  useEffect(() => {
    const fetchSavedMeals = async () => {
      try {
        const data = await getSavedMeals();
        setSavedMeals(data.meals);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedMeals();
  }, []);

  const handleMealClick = async (id: number) => {
    try {
      const mealDetails = await getMealDetails(id);
      setSelectedMeal(mealDetails.meal);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsaveMeal = async () => {
    if (!selectedMeal) return;

    try {
      await deleteSavedMeal(selectedMeal.id);

      setSavedMeals((prev) =>
        prev.filter((meal) => meal.meal_id !== selectedMeal.id),
      );

      setSelectedMeal(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Saved Meals</h1>

        {savedMeals.length === 0 ? (
          <p>No saved meals yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedMeals.map((meal) => (
              <MealCard
                key={meal.meal_id}
                id={meal.meal_id}
                title={meal.title}
                image={meal.image}
                onClick={handleMealClick}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isSaved={true}
          onSave={() => {}}
          onUnsave={handleUnsaveMeal}
        />
      )}
    </>
  );
};

export default SavedMeals;
