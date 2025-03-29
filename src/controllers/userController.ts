/**
 * User Controller Layer
 * 
 * This controller handles HTTP requests and responses for user-related operations.
 * It manages request validation, error handling, and response formatting.
 * 
 * Implementation Approach:
 * 1. Handle HTTP requests and responses
 * 2. Validate input data
 * 3. Process requests through service layer
 * 4. Format responses according to API spec
 * 
 * Technical Decisions:
 * - Separating HTTP concerns from business logic
 * - Implementing consistent error handling
 * - Using TypeScript for type safety
 * - Following RESTful API conventions
 * 
 * Assumptions:
 * 1. Request body contains name and salary
 * 2. Salary is a positive number
 * 3. Name is a non-empty string
 * 4. All responses in JSON format
 */

// Import required types and service
import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { User, ListResponse, SingleResponse } from '../types';

// Get all users with optional filtering and sorting
export const getUsers = (req: Request, res: Response) => {
  try {
    // Get users from service layer
    const users = userService.getUsers();
    
    // Format response according to API specification
    const response: ListResponse<User> = {
      success: true,
      data: users,
      total: users.length,
      offset: 0,
      limit: users.length
    };
    
    res.json(response);
  } catch (error) {
    // Handle any errors during user retrieval
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users',
      data: [],
      total: 0,
      offset: 0
    });
  }
};

// Create a new user
export const createUser = (req: Request, res: Response) => {
  try {
    // Extract and validate request body data
    const { name, salary } = req.body;

    // Validate name field
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required and must be a string',
        data: null
      } as SingleResponse<null>);
    }

    // Validate salary field
    if (!salary || typeof salary !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Salary is required and must be a number',
        data: null
      } as SingleResponse<null>);
    }

    // Create user through service layer
    const newUser = userService.createUser({ name, salary });
    
    // Return success response with created user
    const response: SingleResponse<User> = {
      success: true,
      data: newUser,
      message: 'User created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    // Handle any errors during user creation
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create user',
      data: null
    } as SingleResponse<null>);
  }
}; 
