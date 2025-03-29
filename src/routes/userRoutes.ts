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
import { getUsers, createUser } from '../controllers/userController';

const router = express.Router();

// Define user routes
router.get('/users', getUsers);    // GET /api/users - Retrieve all users
router.post('/users', createUser); // POST /api/users - Create new user

export default router; 