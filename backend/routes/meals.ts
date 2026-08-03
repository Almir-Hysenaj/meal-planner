import express, { Request, Response } from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';
import { runRecommendation } from '../utils/runRecommendation.js';

const router = express.Router();

router.get('/', protect, async (req: Request, res: Response) => {
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

    const formattedMeals = response.data.results.map((meal: any) => ({
      id: meal.id,
      title: meal.title,
      image: meal.image,

      cuisines: meal.cuisines || [],
      dish_types: meal.dishTypes || [],
      diets: meal.diets || [],
      ingredients: meal.extendedIngredients
        ? meal.extendedIngredients.map(
            (ingredient: { name: string }) => ingredient.name,
          )
        : [],

      vegetarian: meal.vegetarian || false,
      vegan: meal.vegan || false,
      gluten_free: meal.glutenFree || false,
      dairy_free: meal.dairyFree || false,

      ready_in_minutes: meal.readyInMinutes || 0,
      servings: meal.servings || 0,

      calories:
        meal.nutrition?.nutrients?.find(
          (n: { name: string; amount: number }) => n.name === 'Calories',
        )?.amount || 0,

      protein:
        meal.nutrition?.nutrients?.find(
          (n: { name: string; amount: number }) => n.name === 'Protein',
        )?.amount || 0,

      carbs:
        meal.nutrition?.nutrients?.find(
          (n: { name: string; amount: number }) => n.name === 'Carbohydrates',
        )?.amount || 0,

      fat:
        meal.nutrition?.nutrients?.find(
          (n: { name: string; amount: number }) => n.name === 'Fat',
        )?.amount || 0,

      created_at: null,
    }));

    const rankedMeals = await runRecommendation(req.user!.id, formattedMeals);

    res.status(200).json({
      meals: rankedMeals,
    });
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).json({
        message: 'Unknown error',
      });
    }
  }
});

router.get('/:id', protect, async (req: Request, res: Response) => {
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
