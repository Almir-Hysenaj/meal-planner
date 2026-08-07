interface MealFilterProps {
  filters: {
    sort?: string;
    diet?: string;
    mealType?: string;
    minCalories?: number;
    maxCalories?: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onApply: () => void;
  onClear: () => void;
}

const filtersStyling =
  ' w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

const MealFilters = ({
  filters,
  setFilters,
  onApply,
  onClear,
}: MealFilterProps) => {
  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Sort By
        </label>

        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({
              ...filters,
              sort: e.target.value,
            })
          }
          className={filtersStyling}
        >
          <option value="">Popularity</option>
          <option value="protein">Protein</option>
          <option value="calories">Calories</option>
          <option value="healthiness">Healthiness</option>
        </select>
      </div>

      {/* Diet */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Diet
        </label>

        <select
          value={filters.diet}
          onChange={(e) =>
            setFilters({
              ...filters,
              diet: e.target.value,
            })
          }
          className={filtersStyling}
        >
          <option value="">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
          <option value="pescetarian">Pescetarian</option>
        </select>
      </div>

      {/* Meal Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Meal Type
        </label>

        <select
          value={filters.mealType}
          onChange={(e) =>
            setFilters({
              ...filters,
              mealType: e.target.value,
            })
          }
          className={filtersStyling}
        >
          <option value="">All Meals</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="main course">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      {/* Calories */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Calories
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minCalories ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                minCalories: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className={filtersStyling}
          />

          <input
            type="number"
            placeholder="Max"
            value={filters.maxCalories ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxCalories: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className={filtersStyling}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onApply}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 cursor-pointer"
        >
          Apply
        </button>

        <button
          onClick={onClear}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default MealFilters;
