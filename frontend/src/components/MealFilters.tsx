import { useState } from 'react';

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

const MealFilters = ({
  filters,
  setFilters,
  onApply,
  onClear,
}: MealFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <select
          value={filters.sort}
          onChange={(e) => {
            setFilters({ ...filters, sort: e.target.value });
          }}
          className="w-1/3 mb-4 mr-3 p-2 border rounded"
        >
          <option value="popularity">Popularity</option>
          <option value="protein">Protein</option>
          <option value="calories">Calories ↑</option>
          <option value="healthiness">Healthiness</option>
        </select>

        <button onClick={() => setShowFilters(!showFilters)}>Filters</button>
      </div>

      {showFilters && (
        <div className="absolute bg-white border rounded p-2 shadow-lg max-w-sm">
          <select
            value={filters.diet}
            onChange={(e) =>
              setFilters({
                ...filters,
                diet: e.target.value,
              })
            }
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten free">Gluten Free</option>
            <option value="ketogenic">Ketogenic</option>
            <option value="pescetarian">Pescetarian</option>
          </select>

          <select
            value={filters.mealType}
            onChange={(e) =>
              setFilters({
                ...filters,
                mealType: e.target.value,
              })
            }
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="main course">Dinner</option>
            <option value="snack">Snack</option>
            <option value="dessert">Dessert</option>
          </select>

          <input
            type="number"
            placeholder="Min Calories"
            value={filters.minCalories ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                minCalories: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-1/2 mb-2 p-2 border rounded"
          ></input>

          <input
            type="number"
            placeholder="Max Calories"
            value={filters.maxCalories ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxCalories: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-1/2 mb-2 p-2 border rounded"
          ></input>

          <div className="flex gap-2 mt-2">
            <button
              onClick={onApply}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>

            <button
              onClick={onClear}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealFilters;
