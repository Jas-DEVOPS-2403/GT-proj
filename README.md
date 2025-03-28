# Express TypeScript Project

This is a basic Express.js project with TypeScript support.

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

## Development

The project uses:
- Express.js for the web framework
- TypeScript for type safety
- CORS for handling cross-origin requests
- dotenv for environment variable management
- nodemon for development hot-reloading

## API Endpoints

- GET `/`: Welcome message 