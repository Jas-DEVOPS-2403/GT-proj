import { User } from '../types';

class UserService {
  private users: User[] = [
    { id: '1', name: 'John Doe', salary: 50000 },
    { id: '2', name: 'Jane Smith', salary: 75000 },
    { id: '3', name: 'Bob Johnson', salary: 65000 },
  ];

  getUsers(): User[] {
    return this.users;
  }
}

export const userService = new UserService(); 