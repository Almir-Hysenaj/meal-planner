import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          apiKey,
          sort: 'popularity',
          number: 5,
        },
      },
    );

    res.status(200).json({
      meals: response.data.results,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

export default router;
