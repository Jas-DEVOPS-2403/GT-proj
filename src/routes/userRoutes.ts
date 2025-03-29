/**
 * User Routes Configuration
 * 
 * This file defines all user-related API endpoints and their HTTP methods.
 * It connects routes to their corresponding controller functions.
 * 
 * Implementation Approach:
 * 1. Set up Express Router
 * 2. Define RESTful API endpoints
 * 3. Connect routes to controller functions
 * 4. Apply route-specific middleware
 * 
 * Technical Decisions:
 * - Using Express Router for modular routing
 * - Following RESTful naming conventions
 * - Grouping related endpoints under /api prefix
 * - Keeping route definitions simple and clear
 * 
 * Assumptions:
 * 1. All routes under /api prefix
 * 2. Following RESTful API conventions
 * 3. No authentication required for MVP
 * 4. Simple CRUD operations
 */

import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

/**
 * Interface defining the structure of a user record
 * Used for type safety in response mapping
 */
interface User {
    name: string;    // User's full name
    salary: number;  // User's salary (0-4000)
}

/**
 * GET /api/users
 * 
 * Retrieves a list of users with optional filtering and pagination.
 * Supports:
 * - Salary range filtering (min/max)
 * - Sorting by name or salary
 * - Pagination with offset and limit
 * 
 * Query Parameters:
 * - min: Minimum salary (default: 0)
 * - max: Maximum salary (default: 4000)
 * - sort: Sort field ('NAME' or 'SALARY')
 * - offset: Number of records to skip (default: 0)
 * - limit: Maximum number of records to return (default: 10)
 */
router.get('/users', async (req, res) => {
    try {
        // Parse and validate query parameters
        const query = {
            min: req.query.min ? Number(req.query.min) : undefined,
            max: req.query.max ? Number(req.query.max) : undefined,
            sort: req.query.sort as 'NAME' | 'SALARY' | undefined,
            offset: req.query.offset ? Number(req.query.offset) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined
        };

        // Fetch users with applied filters
        const response = await userController.getUsers(query);
        res.json(response);
    } catch (error) {
        // Handle errors with appropriate status code and message
        res.status(500).json({
            success: 0,
            error: error instanceof Error ? error.message : 'Failed to fetch users'
        });
    }
});

export default router; 