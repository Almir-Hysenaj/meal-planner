import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';
import calorieCalculator from '../utils/calorieCalculator.js';

const router = express.Router();

// Check if user has profile created
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;

  const profile = await pool.query(
    'SELECT * FROM profiles WHERE user_id = $1',
    [userId],
  );

  if (profile.rows.length === 0) {
    return res.status(200).json({
      profile: null,
      profileComplete: false,
    });
  }

  const userProfile = profile.rows[0];
  const calories = calorieCalculator(userProfile);

  res.status(200).json({
    profile: userProfile,
    profileComplete: true,
    calories,
  });
});

// Create user profile
router.post('/', protect, async (req, res) => {
  const userId = req.user.id;

  const { age, sex, height_cm, weight_kg, activity_level, goal, goal_rate } =
    req.body;

  // Check if fields are entered
  if (
    !age ||
    !sex ||
    !height_cm ||
    !weight_kg ||
    !activity_level ||
    !goal ||
    goal_rate == undefined
  ) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Check if profile already exists
  const existingProfile = await pool.query(
    'SELECT id FROM profiles WHERE user_id = $1',
    [userId],
  );

  if (existingProfile.rows.length > 0) {
    return res.status(400).json({ message: 'Profile already exists' });
  }

  // Create new profile
  const newProfile = await pool.query(
    `INSERT INTO profiles 
      (user_id, age, sex, height_cm, weight_kg, activity_level, goal, goal_rate) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [userId, age, sex, height_cm, weight_kg, activity_level, goal, goal_rate],
  );

  res.status(201).json({
    profile: newProfile.rows[0],
    profileComplete: true,
  });
});

// Update user profile
router.put('/', protect, async (req, res) => {
  const userId = req.user.id;

  const { age, sex, height_cm, weight_kg, activity_level, goal, goal_rate } =
    req.body;

  // Check if fields are entered
  if (
    !age ||
    !sex ||
    !height_cm ||
    !weight_kg ||
    !activity_level ||
    !goal ||
    goal_rate == undefined
  ) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const updatedProfile = await pool.query(
    `UPDATE profiles
    SET age = $1, sex = $2, height_cm = $3, weight_kg = $4, activity_level = $5, goal = $6, goal_rate = $7, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $8
    RETURNING *`,
    [age, sex, height_cm, weight_kg, activity_level, goal, goal_rate, userId],
  );

  if (updatedProfile.rows.length === 0) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.status(200).json({
    profile: updatedProfile.rows[0],
    profileComplete: true,
  });
});

export default router;
