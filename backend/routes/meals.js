import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

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
          number: 5,
          addRecipeNutrition: true,
          sort,
          diet,
          type: mealType,
          minCalories,
          maxCalories,
        },
      },
    );

    res.status(200).json({ meals: response.data.results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch meals' });
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
