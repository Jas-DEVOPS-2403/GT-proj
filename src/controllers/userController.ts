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
 */

import { PrismaClient } from '@prisma/client';

/**
 * Interface defining the structure of query parameters for user filtering
 */
interface UserQueryParams {
    min?: number;      // Minimum salary filter
    max?: number;      // Maximum salary filter
    sort?: 'NAME' | 'SALARY';  // Sort field and direction
    offset?: number;   // Number of records to skip (for pagination)
    limit?: number;    // Maximum number of records to return
}

interface User {
    name: string;
    salary: number;
}

export class UserController {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Retrieves users based on query parameters
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

        // Return formatted response
        return {
            results: users.map((user: User) => ({
                name: user.name,
                salary: user.salary
            }))
        };
    }
} 