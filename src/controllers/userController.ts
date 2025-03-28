import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const getUsers = (req: Request, res: Response) => {
  try {
    const users = userService.getUsers();
    // Set the content type to JSON and format the response
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users' 
    });
  }
}; 