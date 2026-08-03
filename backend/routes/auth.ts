import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

// Register

router.post('/register', async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (userExists.rows.length > 0) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
    [first_name, last_name, email, hashedPassword],
  );

  const token = generateToken(newUser.rows[0].id);

  res.cookie('token', token, cookieOptions);

  res.status(201).json({ user: newUser.rows[0] });
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const user = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (user.rows.length === 0) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const token = generateToken(userData.id);

  res.cookie('token', token, cookieOptions);

  res.json({
    user: {
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
    },
  });
});

// Me
router.get('/me', protect, (req: Request, res: Response) => {
  res.json(req.user);
  // return info of the logged in user from protect middleware
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
  res.json({ message: 'Logged out successfully' });
});

export default router;
