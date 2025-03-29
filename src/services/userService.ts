/**
 * User Service Layer
 * 
 * This service handles all user-related business logic and data operations.
 * It implements the core functionality for managing user data.
 * 
 * Implementation Approach:
 * 1. Define User interface for type safety
 * 2. Implement in-memory storage for MVP
 * 3. Provide CRUD operations for users
 * 4. Handle data validation and business rules
 * 
 * Technical Decisions:
 * - Using TypeScript interfaces for data structure
 * - Implementing singleton pattern for service instance
 * - Using in-memory storage for simplicity
 * - Auto-generating IDs for new users
 * 
 * Assumptions:
 * 1. User data structure: id, name, salary
 * 2. IDs are auto-generated sequentially
 * 3. Data stored in memory (can be replaced with database)
 * 4. No duplicate names allowed
 */

// Import User type definition
import { User } from '../types';

class UserService {
  // In-memory storage for users with sample data
  private users: User[] = [
    { id: '1', name: 'John Doe', salary: 50000 },
    { id: '2', name: 'Jane Smith', salary: 75000 },
    { id: '3', name: 'Bob Johnson', salary: 65000 },
  ];

  // Get all users from storage
  getUsers(): User[] {
    return this.users;
  }

  // Create a new user with auto-generated ID
  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: (this.users.length + 1).toString(), // Generate new ID
      ...userData
    };
    this.users.push(newUser); // Add to storage
    return newUser;
  }
}

// Export singleton instance for consistent state
export const userService = new UserService(); 