# GT-Proj: Express TypeScript Implementation

This project demonstrates the implementation of a RESTful API using Express.js with TypeScript. The project showcases modern TypeScript features and best practices in a Node.js environment.

## TypeScript Implementation Details

The project uses TypeScript to provide:
- Static type checking
- Interface definitions
- Type inference
- Enhanced IDE support
- Better code maintainability

### Key TypeScript Features Used:
- Type annotations for Express Request/Response objects
- Interface definitions for data models
- Type-safe middleware implementation
- Strict type checking enabled in tsconfig.json

## Project Structure

```
src/
  ├── index.ts          # Main application entry point with Express setup
  ├── routes/           # Route definitions with TypeScript interfaces
  ├── controllers/      # Route controllers with type-safe request handling
  ├── middleware/       # Custom middleware with proper typing
  ├── models/          # Data models with TypeScript interfaces
  └── services/        # Business logic with type safety
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (already done with basic configuration)

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests (when implemented)

## Development

The project uses:
- Express.js for the web framework
- TypeScript for type safety
- CORS for handling cross-origin requests
- dotenv for environment variable management
- nodemon for development hot-reloading

## API Endpoints

- GET `/`: Welcome message

## TypeScript Configuration

The project uses a strict TypeScript configuration (`tsconfig.json`) with:
- ES2018 target
- CommonJS modules
- Strict type checking
- Path aliases for better imports
- Source maps for debugging 