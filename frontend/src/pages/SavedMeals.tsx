import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MealCard from '../components/MealCard';
import MealDetailsModal from '../components/MealDetailsModal';
import MessageModal from '../components/MessageToast';
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
  const [messageModal, setMessageModal] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchSavedMeals = async () => {
      try {
        const data = await getSavedMeals();
        setSavedMeals(data.meals);
      } catch (err) {
        console.error(err);

        setMessageModal({
          type: 'error',
          message: 'Failed to fetch saved meals. Please try again.',
        });
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

      setMessageModal({
        type: 'error',
        message: 'Failed to fetch meal details. Please try again.',
      });
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

      setMessageModal({
        type: 'success',
        message: 'Meal removed from saved meals.',
      });
    } catch (err) {
      console.error(err);

      setMessageModal({
        type: 'error',
        message: 'Failed to remove meal. Please try again.',
      });
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-25">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Meals</h1>

          <p className="mt-2 text-gray-500">Your favourite meals.</p>
        </div>

        {/* Empty state */}
        {savedMeals.length === 0 ? (
          <div
            className="
          flex
          min-h-75
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-gray-300
          bg-gray-50
          px-6
          text-center
        "
          >
            <h2 className="text-xl font-semibold text-gray-800">
              No saved meals yet
            </h2>

            <p className="mt-2 max-w-md text-gray-500">
              When you find a meal you like, save it and it will appear here.
            </p>
          </div>
        ) : (
          /* Meal grid */
          <div
            className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        "
          >
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

      {/* Meal details modal */}
      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          isSaved={true}
          onSave={() => {}}
          onUnsave={handleUnsaveMeal}
        />
      )}

      {messageModal && (
        <MessageModal
          type={messageModal.type}
          message={messageModal.message}
          onClose={() => setMessageModal(null)}
        />
      )}
    </>
  );
};

export default SavedMeals;
