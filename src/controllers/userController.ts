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
import { User, ListResponse, SingleResponse, UserQueryParams } from '../types';

// Get all users with optional filtering and sorting
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Extract and validate query parameters
    const params: UserQueryParams = {
      min: req.query.min ? Number(req.query.min) : undefined,
      max: req.query.max ? Number(req.query.max) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
      sort: req.query.sort as 'NAME' | 'SALARY' | undefined
    };

    // Validate numeric parameters
    if (params.min !== undefined && isNaN(params.min)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid min parameter',
        data: null
      } as SingleResponse<null>);
    }

    if (params.max !== undefined && isNaN(params.max)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid max parameter',
        data: null
      } as SingleResponse<null>);
    }

    if (params.offset !== undefined && isNaN(params.offset)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid offset parameter',
        data: null
      } as SingleResponse<null>);
    }

    if (params.pageSize !== undefined && isNaN(params.pageSize)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pageSize parameter',
        data: null
      } as SingleResponse<null>);
    }

    // Get users from service layer
    const { users, total } = await userService.getUsers(params);
    
    // Format response according to API specification
    const response: ListResponse<User> = {
      success: true,
      data: users,
      total,
      offset: params.offset || 0,
      pageSize: params.pageSize
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
export const createUser = async (req: Request, res: Response) => {
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
    const newUser = await userService.createUser({ name, salary });
    
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
