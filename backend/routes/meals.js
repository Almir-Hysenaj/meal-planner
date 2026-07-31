import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';
import { runRecommendation } from '../utils/runRecommendation.js';

const router = express.Router();

const meals = [
  {
    id: 945221,
    title:
      'Watching What I Eat: Peanut Butter Banana Oat Breakfast Cookies with Carob / Chocolate Chips',
    image: 'https://img.spoonacular.com/recipes/945221-312x231.jpg',
    imageType: 'jpg',
  },
  {
    id: 715449,
    title: 'How to Make OREO Turkeys for Thanksgiving',
    image: 'https://img.spoonacular.com/recipes/715449-312x231.jpg',
    imageType: 'jpg',
  },
  {
    id: 776505,
    title: 'Sausage & Pepperoni Stromboli',
    image: 'https://img.spoonacular.com/recipes/776505-312x231.jpg',
    imageType: 'jpg',
  },
  {
    id: 716410,
    title: 'Cannoli Ice Cream w. Pistachios & Dark Chocolate',
    image: 'https://img.spoonacular.com/recipes/716410-312x231.jpg',
    imageType: 'jpg',
  },
  {
    id: 715467,
    title: 'Turkey Pot Pie',
    image: 'https://img.spoonacular.com/recipes/715467-312x231.jpg',
    imageType: 'jpg',
  },
];

router.get('/', protect, async (req, res) => {
  const { sort, diet, mealType, minCalories, maxCalories } = req.query;

  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          apiKey,
          number: 20,
          addRecipeNutrition: true,
          sort,
          diet,
          type: mealType,
          minCalories,
          maxCalories,
        },
      },
    );

    const formattedMeals = response.data.results.map((meal) => ({
      id: meal.id,
      title: meal.title,
      image: meal.image,

      cuisines: meal.cuisines || [],
      dish_types: meal.dishTypes || [],
      diets: meal.diets || [],
      ingredients: meal.extendedIngredients
        ? meal.extendedIngredients.map((ingredient) => ingredient.name)
        : [],

      vegetarian: meal.vegetarian || false,
      vegan: meal.vegan || false,
      gluten_free: meal.glutenFree || false,
      dairy_free: meal.dairyFree || false,

      ready_in_minutes: meal.readyInMinutes || 0,
      servings: meal.servings || 0,

      calories:
        meal.nutrition?.nutrients?.find((n) => n.name === 'Calories')?.amount ||
        0,

      protein:
        meal.nutrition?.nutrients?.find((n) => n.name === 'Protein')?.amount ||
        0,

      carbs:
        meal.nutrition?.nutrients?.find((n) => n.name === 'Carbohydrates')
          ?.amount || 0,

      fat:
        meal.nutrition?.nutrients?.find((n) => n.name === 'Fat')?.amount || 0,

      created_at: null,
    }));

    const rankedMeals = await runRecommendation(req.user.id, formattedMeals);

    res.status(200).json({
      meals: rankedMeals,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information`,
      {
        params: {
          apiKey,
          includeNutrition: true,
        },
      },
    );

    res.status(200).json({
      meal: response.data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch meal info' });
  }
});

export default router;
