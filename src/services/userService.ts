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

import { User, UserQueryParams } from '../types';

class UserService {
  // In-memory storage for users
  private users: User[] = [];
  private nextId: number = 1;

  // Get all users with filtering, sorting, and page size
  getUsers(params: UserQueryParams = {}): { users: User[], total: number } {
    let filteredUsers = [...this.users];

    // Apply salary filtering
    if (params.min !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.salary >= params.min!);
    }
    if (params.max !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.salary <= params.max!);
    }

    // Apply sorting
    if (params.sort) {
      filteredUsers.sort((a, b) => {
        if (params.sort === 'NAME') {
          return a.name.localeCompare(b.name);
        } else if (params.sort === 'SALARY') {
          return a.salary - b.salary;
        }
        return 0;
      });
    }

    // Apply page size
    const offset = params.offset || 0;
    const pageSize = params.pageSize;
    const paginatedUsers = pageSize 
      ? filteredUsers.slice(offset, offset + pageSize)
      : filteredUsers.slice(offset);

    return {
      users: paginatedUsers,
      total: filteredUsers.length
    };
  }

  // Create a new user with auto-generated ID
  createUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.nextId.toString(),
      ...userData
    };
    this.users.push(newUser);
    this.nextId++;
    return newUser;
  }
}

// Export singleton instance for consistent state
export const userService = new UserService(); 