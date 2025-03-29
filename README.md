# Express TypeScript API

A RESTful API built with Express and TypeScript, implementing user management with filtering, sorting, and page size.

## Features

- User management (create, read)
- Filter users by salary range
- Sort users by name or salary
- Page size support
- TypeScript for type safety
- Modular architecture
- CSV file upload support
- Automatic data validation
- Database persistence with Prisma

## API Endpoints

### GET /api/users

Retrieves a list of users with optional filtering, sorting, and page size.

#### Query Parameters

| Parameter | Type    | Default    | Description                                    |
|-----------|---------|------------|------------------------------------------------|
| min       | number  | 0.0        | Minimum salary filter                          |
| max       | number  | 4000.0     | Maximum salary filter                          |
| offset    | number  | 0          | Number of records to skip                      |
| limit     | number  | 10         | Maximum number of records to return            |
| sort      | string  | optional   | Sort field (NAME or SALARY)                    |

#### Example Requests

1. Get all users:
```
GET http://localhost:3000/api/users
```

2. Filter by salary range:
```
GET http://localhost:3000/api/users?min=2500&max=3000
```

3. Sort by salary:
```
GET http://localhost:3000/api/users?sort=SALARY
```

4. Sort by name:
```
GET http://localhost:3000/api/users?sort=NAME
```

5. Use limitors:
```
GET http://localhost:3000/api/users?offset=0&limit=5
```

6. Combine filters:
```
GET http://localhost:3000/api/users?min=2500&max=3000&sort=SALARY&limit=5
```

#### Response Format
```json
{
  "results": [
    {
      "name": "John Doe",
      "salary": 2500
    }
  ]
}
```

### POST /upload

Uploads a CSV file containing user data.

#### Request Format
- Content-Type: multipart/form-data
- File field name: "file"
- File type: CSV

#### CSV Format
```csv
name,salary
John Doe,2500
Jane Smith,3000
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate reset --force
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3000 by default.

## Project Structure

```
src/
├── controllers/    # Request handlers
├── services/      # Business logic
├── routes/        # API routes
├── types/         # TypeScript type definitions
└── index.ts       # Application entry point
```

## Technologies Used

- Node.js
- Express
- TypeScript
- Prisma (SQLite)
- Nodemon (for development)
- Multer (for file uploads)
- CSV Parser

## Development

The project uses:
- Express.js for the web framework
- TypeScript for type safety
- CORS for handling cross-origin requests
- dotenv for environment variable management
- nodemon for development hot-reloading
- Prisma for database operations
- Multer for file upload handling

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests (when implemented)

## Testing Guide

### 1. Basic API Functionality
- Visit `http://localhost:3000` to access the CSV upload interface
- Visit `http://localhost:3000/api/users` to view all users
- Visit `http://localhost:5555` to access Prisma Studio (database viewer)

### 2. Test Cases

#### Test Case 1: User Data Retrieval and Filtering
1. Verify initial data load:
   - Access `http://localhost:3000/api/users`
   - Confirm response format matches:
     ```json
     {
       "results": [
         { "name": "Alex", "salary": 3000.0 },
         { "name": "Bryan", "salary": 3500.0 }
       ]
     }
     ```
   - Verify all salaries are between 0 and 4000

2. Test filtering parameters:
   - Test min/max: `http://localhost:3000/api/users?min=2500&max=3500`
   - Test sorting: 
     - Valid: `http://localhost:3000/api/users?sort=NAME` or `?sort=SALARY`
     - Invalid: `http://localhost:3000/api/users?sort=INVALID`
   - Test pagination: `http://localhost:3000/api/users?offset=0&limit=2`

#### Test Case 2: Valid CSV Upload
1. Create a CSV file with mixed data:
   ```
   name,salary
   John Doe,75000
   Jane Smith,65000
   Alice Johnson,0.00
   Bob Wilson,-50000
   Charlie Brown,85000
   David Lee,0.00
   Emma Davis,95000
   ```
2. Upload the file through the web interface
3. Verify results:
   - Check `/api/users` endpoint
   - Confirm new records are added
   - Verify existing records are updated
   - Confirm negative salaries are ignored
   - Verify zero salaries are accepted and returned
   - Check that all returned salaries are within 0-4000 range

#### Test Case 3: Invalid CSV Upload
1. Create a CSV file with invalid structure:
   ```
   name,salary
   John Doe,75000
   Jane Smith,invalid
   Alice Johnson,0.00
   Bob Wilson,abc
   David Lee,0.00
   ```
2. Upload the file
3. Verify results:
   - File should be rejected
   - No records should be saved
   - Error message should be displayed
   - Database should remain unchanged
   - `/api/users` endpoint should return original data 