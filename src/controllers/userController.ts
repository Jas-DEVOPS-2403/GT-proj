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

export const createUser = (req: Request, res: Response) => {
  try {
    const { name, salary } = req.body;

    // Basic validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required and must be a string' 
      });
    }

    if (!salary || typeof salary !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Salary is required and must be a number' 
      });
    }

    const newUser = userService.createUser({ name, salary });
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create user' 
    });
  }
}; 
