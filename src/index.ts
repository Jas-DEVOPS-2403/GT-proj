/**
 * Main Application Entry Point
 * 
 * This file serves as the entry point for our Express application.
 * It sets up the server, configures middleware, and defines routes.
 * 
 * Implementation Approach:
 * 1. Set up Express with TypeScript for type safety
 * 2. Configure essential middleware (CORS, JSON parsing)
 * 3. Define API routes under /api prefix
 * 4. Implement error handling and health check
 * 
 * Technical Decisions:
 * - Using TypeScript for better type safety and developer experience
 * - Implementing CORS to allow cross-origin requests
 * - Using environment variables for configuration
 * - Following RESTful API conventions
 * 
 * Assumptions:
 * 1. API will be consumed by frontend applications
 * 2. All data will be in JSON format
 * 3. Server runs on port 3000
 * 4. No authentication required for MVP
 */

// Import required packages and types
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app: Express = express();
const port = process.env.PORT || 3000;

// Set up middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Register routes
app.use('/api', userRoutes);  // Mount user routes under /api prefix

// Health check endpoint for monitoring
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 