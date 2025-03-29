# Express TypeScript API

A RESTful API built with Express and TypeScript, implementing user management with filtering, sorting, and page size.

## Features

- User management (create, read)
- Filter users by salary range
- Sort users by name or salary
- Page size support
- TypeScript for type safety
- Modular architecture

## API Endpoints

### GET /api/users

Retrieves a list of users with optional filtering, sorting, and page size.

#### Query Parameters

| Parameter | Type    | Default    | Description                                    |
|-----------|---------|------------|------------------------------------------------|
| min       | number  | 0.0        | Minimum salary filter                          |
| max       | number  | 4000.0     | Maximum salary filter                          |
| offset    | number  | 0          | Number of records to skip                      |
| pageSize  | number  | optional   | Maximum number of records to return            |
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

5. Use page size:
```
GET http://localhost:3000/api/users?pageSize=2
```

6. Combine filters:
```
GET http://localhost:3000/api/users?min=2500&max=3000&sort=SALARY&pageSize=2
```

#### Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "salary": 2500
    }
  ],
  "total": 1,
  "offset": 0,
  "pageSize": 2
}
```

### POST /api/users

Creates a new user.

#### Request Body
```json
{
  "name": "John Doe",
  "salary": 2500
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Doe",
    "salary": 2500
  },
  "message": "User created successfully"
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
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
- Nodemon (for development)

## Development

The project uses:
- Express.js for the web framework
- TypeScript for type safety
- CORS for handling cross-origin requests
- dotenv for environment variable management
- nodemon for development hot-reloading

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests (when implemented)

## Project Structure

```
src/
  ├── index.ts          # Main application entry point
  ├── routes/           # Route definitions
  ├── controllers/      # Route controllers
  ├── middleware/       # Custom middleware
  ├── models/          # Data models
  └── services/        # Business logic
``` 