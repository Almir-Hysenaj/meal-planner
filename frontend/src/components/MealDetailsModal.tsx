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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white cursor-pointer"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src={meal.image}
            alt={meal.title}
            className="h-80 w-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-8">
            <h2 className="max-w-3xl text-3xl font-bold text-white">
              {meal.title}
            </h2>
          </div>
        </div>

        <div className="p-8">
          {/* Nutrition cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: 'Calories',
                value: meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Calories',
                )?.amount,
                unit: 'kcal',
              },
              {
                label: 'Protein',
                value: meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Protein',
                )?.amount,
                unit: 'g',
              },
              {
                label: 'Carbs',
                value: meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Carbohydrates',
                )?.amount,
                unit: 'g',
              },
              {
                label: 'Fat',
                value: meal.nutrition?.nutrients?.find(
                  (n: any) => n.name === 'Fat',
                )?.amount,
                unit: 'g',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-gray-500">{item.label}</p>

                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {Math.round(item.value ?? 0)}
                  {item.unit}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {[
              meal.glutenFree && 'Gluten Free',
              meal.dairyFree && 'Dairy Free',
              meal.vegan && 'Vegan',
              meal.vegetarian && 'Vegetarian',
            ]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag as string}
                  className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Recipe info */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Cooking Time</p>
              <p className="font-semibold">{meal.readyInMinutes} mins</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-semibold">{meal.servings}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold">
                £{(meal.pricePerServing / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Ingredients */}
          <h3 className="mb-4 text-2xl font-bold">Ingredients</h3>

          <div className="mb-8 grid grid-cols-1 gap-2 md:grid-cols-2">
            {meal.extendedIngredients?.map((ingredient: any) => (
              <div
                key={ingredient.id}
                className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700"
              >
                {ingredient.original}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={meal.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              View Recipe
            </a>

            <button
              onClick={isSaved ? onUnsave : onSave}
              className={`rounded-xl px-6 py-3 font-medium text-white transition cursor-pointer
              ${
                isSaved
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-teal-600 hover:bg-teal-700'
              }
            `}
            >
              {isSaved ? 'Remove Saved' : 'Save Meal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
