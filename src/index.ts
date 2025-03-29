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
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

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

/**
 * Middleware to format JSON responses with proper indentation
 * This ensures all JSON responses are human-readable
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function(data) {
        // Format the data with 2-space indentation
        const formattedData = JSON.stringify(data, null, 2);
        // Set the content type to ensure proper formatting
        res.setHeader('Content-Type', 'application/json');
        // Send the formatted data
        return res.send(formattedData);
    };
    next();
});

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

/**
 * File Upload Endpoint
 * 
 * Handles CSV file uploads, validates the data, and updates the database.
 * 
 * Implementation Approach:
 * 1. Accept CSV file upload using multer
 * 2. Validate file format and content
 * 3. Process valid records
 * 4. Update database with new/updated records
 * 5. Clean up temporary files
 * 
 * Technical Decisions:
 * - Using multer for file upload handling
 * - CSV parsing with csv-parser package
 * - Automatic file cleanup after processing
 * - Transaction-like behavior for data consistency
 * 
 * Assumptions:
 * 1. CSV files have name and salary columns
 * 2. Salaries are non-negative numbers
 * 3. Names are unique identifiers
 * 4. Files are properly formatted CSV
 */
app.post('/upload', upload.single('file'), async (req: MulterRequest, res: Response) => {
    // Validate file presence
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
                    // Validate each row
                    if (!data.name || !data.salary) {
                        reject(new Error('Invalid CSV format: missing required fields'));
                    }
                    
                    // Convert salary to number and validate
                    const salary = parseFloat(data.salary);
                    if (isNaN(salary)) {
                        reject(new Error('Invalid salary format'));
                    }
                    
                    // Only process rows with non-negative salaries
                    if (salary >= 0) {
                        results.push({
                            name: data.name,
                            salary: salary
                        });
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Process the valid results
        for (const user of results) {
            // Check if user exists
            const existingUser = await prisma.user.findFirst({
                where: { name: user.name }
            });

            if (existingUser) {
                // Update existing user
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { salary: user.salary }
                });
            } else {
                // Create new user
                await prisma.user.create({
                    data: user
                });
            }
        }

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        // Return formatted response
        res.json({ 
            success: true,
            data: {
                message: `Processed ${results.length} records successfully`,
                processedRecords: results,
                total: results.length
            }
        });
    } catch (error) {
        // Clean up the uploaded file in case of error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process file'
        });
    }
});

/**
 * Health Check Endpoint
 * 
 * Simple endpoint to verify the API is running and responsive.
 * Used for monitoring and deployment verification.
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

/**
 * Global Error Handler
 * 
 * Catches any unhandled errors in the application and returns
 * a consistent error response format.
 * 
 * Implementation Approach:
 * 1. Log error details for debugging
 * 2. Return standardized error response
 * 3. Set appropriate HTTP status code
 * 
 * Technical Decisions:
 * - Using 500 status for server errors
 * - Including error message in response
 * - Logging errors for debugging
 */
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