interface MealDetailModalProps {
  meal: any;
  onClose: () => void;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

const MealDetailsModal = ({
  meal,
  onClose,
  isSaved,
  onSave,
  onUnsave,
}: MealDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">{meal.title}</h2>

        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="font-bold">
              {
                meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Calories',
                )?.amount
              }
              kcal
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Protein</p>
            <p className="font-bold">
              {
                meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Protein',
                )?.amount
              }
              g
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="font-bold">
              {
                meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Carbohydrates',
                )?.amount
              }
              g
            </p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Fat</p>
            <p className="font-bold">
              {
                meal.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')
                  ?.amount
              }
              g
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {meal.glutenFree && (
            <span className="bg-green-100 px-3 py-1 rounded">Gluten Free</span>
          )}

          {meal.dairyFree && (
            <span className="bg-green-100 px-3 py-1 rounded">Dairy Free</span>
          )}

          {meal.vegan && (
            <span className="bg-green-100 px-3 py-1 rounded">Vegan</span>
          )}

          {meal.vegetarian && (
            <span className="bg-green-100 px-3 py-1 rounded">Vegetarian</span>
          )}
        </div>

        <div className="mb-6">
          <p>
            <strong>Ready in:</strong> {meal.readyInMinutes} mins
          </p>

          <p>
            <strong>Servings:</strong> {meal.servings}
          </p>

          <p>
            <strong>Price per serving:</strong> £
            {(meal.pricePerServing / 100).toFixed(2)}
          </p>
        </div>

        <h3 className="text-xl font-bold mb-3">Ingredients</h3>

        <ul className="list-disc pl-5 space-y-1 mb-6">
          {meal.extendedIngredients?.map((ingredient: any) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>

        <a
          href={meal.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Full Recipe
        </a>

        {/* Save button */}
        {isSaved ? (
          <button
            onClick={onUnsave}
            className="cursor-pointer ml-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Remove from Saved
          </button>
        ) : (
          <button
            onClick={onSave}
            className="cursor-pointer ml-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Meal
          </button>
        )}
      </div>
    </div>
  );
};

export default MealDetailsModal;
