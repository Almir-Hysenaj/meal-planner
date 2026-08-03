import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';

interface JwtPayload {
  id: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: 'Not authorized, no token',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [decoded.id],
    );

    if (user.rows.length === 0) {
      res.status(401).json({
        message: 'Not authorized, user not found',
      });
      return;
    }

    req.user = user.rows[0];

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};
