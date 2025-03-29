/**
 * Type Definitions
 * 
 * This file contains TypeScript interfaces and types used throughout the application.
 * It defines the shape of data structures and ensures type safety across the codebase.
 * 
 * Implementation Approach:
 * 1. Define core data interfaces
 * 2. Use TypeScript's type system for validation
 * 3. Export types for use in other modules
 * 
 * Technical Decisions:
 * - Using TypeScript interfaces for data structures
 * - Keeping types in a central location
 * - Using strict typing for all fields
 * 
 * Assumptions:
 * 1. User IDs are strings
 * 2. Names are non-empty strings
 * 3. Salaries are positive numbers
 */

/**
 * User Interface
 * 
 * Defines the structure of a user object in the system.
 * Used for type checking and documentation of user data.
 */
export interface User {
  id: string;      // Unique identifier for the user
  name: string;    // User's full name
  salary: number;  // User's annual salary
}

/**
 * Query Parameters Interface
 * 
 * Defines the structure of query parameters for user filtering and pagination.
 */
export interface UserQueryParams {
  min?: number;    // Minimum salary filter (default: 0.0)
  max?: number;    // Maximum salary filter (default: 4000.0)
  offset?: number; // Number of records to skip (default: 0)
  limit?: number;  // Maximum number of records to return
  sort?: 'NAME' | 'SALARY'; // Sort field
}

/**
 * List Response Interface
 * 
 * Defines the structure of list API responses with pagination.
 */
export interface ListResponse<T> {
  success: boolean;    // Indicates if the request was successful
  data: T[];          // Array of items for the current page
  total: number;      // Total number of items
  offset: number;     // Current offset
  limit?: number;     // Maximum number of items per page
}

/**
 * Single Item Response Interface
 * 
 * Defines the structure of single item API responses.
 */
export interface SingleResponse<T> {
  success: boolean;    // Indicates if the request was successful
  data: T;            // The item data
  message?: string;    // Optional success message
} 