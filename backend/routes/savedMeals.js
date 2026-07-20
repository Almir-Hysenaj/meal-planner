import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all saved meals
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;

  const savedMeals = await pool.query(
    `SELECT meal_id, title, image
     FROM saved_meals
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  res.status(200).json({
    meals: savedMeals.rows,
  });
});

// Save a meal
router.post('/', protect, async (req, res) => {
  const userId = req.user.id;

  const { meal_id, title, image } = req.body;

  if (!meal_id || !title || !image) {
    return res.status(400).json({
      message: 'Please provide meal information',
    });
  }

  const existingMeal = await pool.query(
    `SELECT id
     FROM saved_meals
     WHERE user_id = $1
     AND meal_id = $2`,
    [userId, meal_id],
  );

  if (existingMeal.rows.length > 0) {
    return res.status(400).json({
      message: 'Meal already saved',
    });
  }

  const newMeal = await pool.query(
    `INSERT INTO saved_meals
      (user_id, meal_id, title, image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, meal_id, title, image],
  );

  res.status(201).json({
    meal: newMeal.rows[0],
  });
});

// Delete saved meal
router.delete('/:mealId', protect, async (req, res) => {
  const userId = req.user.id;
  const { mealId } = req.params;

  const deletedMeal = await pool.query(
    `DELETE FROM saved_meals
     WHERE user_id = $1
     AND meal_id = $2
     RETURNING *`,
    [userId, mealId],
  );

  if (deletedMeal.rows.length === 0) {
    return res.status(404).json({
      message: 'Saved meal not found',
    });
  }

  res.status(200).json({
    message: 'Meal removed',
  });
});

export default router;
