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
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app: Express = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Set up middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Remove the Content-Type: application/json header for non-API routes
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Register routes
app.use('/api', userRoutes);  // Mount user routes under /api prefix

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// File upload endpoint
app.post('/upload', upload.single('file'), async (req: MulterRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, error: 'No file uploaded' });
    }

    try {
        const results: any[] = [];
        const filePath = req.file.path;

        // Read and validate CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data: any) => {
                    // Validate each row here
                    // For example, check if required fields exist
                    if (!data.name || !data.salary) {
                        reject(new Error('Invalid CSV format: missing required fields'));
                    }
                    results.push(data);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // If validation passes, update the database
        // This is where you would update your user data
        // For now, we'll just return success

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.json({ success: 1 });
    } catch (error) {
        // Clean up the uploaded file in case of error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ 
            success: 0, 
            error: error instanceof Error ? error.message : 'Failed to process file' 
        });
    }
});

// Health check endpoint for monitoring
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    data: null
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 