/**
 * User Controller
 * 
 * Handles all user-related business logic and database operations.
 * Implements filtering, sorting, and pagination for user queries.
 * 
 * Implementation Approach:
 * 1. Uses Prisma Client for database operations
 * 2. Implements query parameter validation
 * 3. Provides flexible filtering and sorting options
 * 4. Handles pagination for large datasets
 * 
 * Technical Decisions:
 * - Using Prisma for type-safe database operations
 * - Implementing default values for filters
 * - Using TypeScript interfaces for type safety
 * - Keeping response format consistent
 * 
 * Assumptions:
 * 1. Salary range is 0-4000
 * 2. Default page size is 10 records
 * 3. Names are unique identifiers
 * 4. All salaries are non-negative
 */

import { PrismaClient } from '@prisma/client';

/**
 * Interface defining the structure of query parameters for user filtering
 * Used for type safety and documentation of API parameters
 */
interface UserQueryParams {
    min?: number;      // Minimum salary filter (default: 0)
    max?: number;      // Maximum salary filter (default: 4000)
    sort?: 'NAME' | 'SALARY';  // Sort field and direction
    offset?: number;   // Number of records to skip (for pagination)
    limit?: number;    // Maximum number of records to return (default: 10)
}

/**
 * Interface defining the structure of a user record
 * Used for type safety in response mapping
 */
interface User {
    name: string;    // User's full name
    salary: number;  // User's salary (0-4000)
}

export class UserController {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Retrieves users based on query parameters
     * 
     * Implementation Details:
     * 1. Builds where clause for salary filtering
     * 2. Configures sorting based on sort parameter
     * 3. Applies pagination with offset and limit
     * 4. Returns formatted response with only name and salary
     * 
     * @param query - Filtering and pagination parameters
     * @returns Promise containing filtered and sorted user records
     */
    async getUsers(query: UserQueryParams) {
        // Build where clause for salary filtering
        const where: any = {
            salary: {
                gte: query.min || 0,    // Default minimum salary is 0
                lte: query.max || 4000  // Default maximum salary is 4000
            }
        };

        // Build order by clause for sorting
        const orderBy: any = {};
        if (query.sort === 'NAME') {
            orderBy.name = 'asc';
        } else if (query.sort === 'SALARY') {
            orderBy.salary = 'asc';
        }

        // Execute database query with filters, sorting, and pagination
        const users = await this.prisma.user.findMany({
            where,
            orderBy,
            skip: query.offset || 0,    // Default offset is 0
            take: query.limit || 10     // Default limit is 10 records
        });

        // Return formatted response with metadata
        return {
            success: true,
            data: {
                users: users.map((user: User) => ({
                    name: user.name,
                    salary: user.salary
                })),
                total: users.length,
                filters: {
                    min: query.min || 0,
                    max: query.max || 4000,
                    sort: query.sort || 'none',
                    offset: query.offset || 0,
                    limit: query.limit || 10
                }
            }
        };
    }
} 