# Field Services UI

Modern React frontend application for the Field Services Management System.

## Overview

This is a React-based user interface built with modern tools and best practices for managing field service operations. The application is designed to integrate seamlessly with the Field Services microservices backend.

## Technology Stack

- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **React Hooks** - Modern React patterns

## Features

- ✅ TypeScript for type safety
- ✅ Modern React with hooks
- ✅ Vite for fast development and optimized builds
- ✅ ESLint + Prettier for code quality
- ✅ Environment-based configuration
- ✅ API service layer for backend integration
- ✅ Custom hooks for common patterns
- ✅ Reusable component library
- ✅ Organized project structure

## Project Structure

```
field-services-ui/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, styles, etc.
│   │   ├── images/
│   │   └── styles/
│   ├── components/      # React components
│   │   ├── common/      # Reusable components (Button, Input, etc.)
│   │   ├── features/    # Feature-specific components
│   │   └── layout/      # Layout components (Header, Footer, Layout)
│   ├── config/          # Configuration files
│   │   └── env.ts       # Environment configuration
│   ├── hooks/           # Custom React hooks
│   │   └── useApi.ts    # API hook for data fetching
│   ├── services/        # API services
│   │   └── api.service.ts
│   ├── types/           # TypeScript type definitions
│   │   └── common.ts
│   ├── utils/           # Utility functions
│   │   └── logger.ts
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── vite-env.d.ts    # Vite environment types
├── .env.example         # Example environment variables
├── .env.development     # Development environment variables
├── .prettierrc          # Prettier configuration
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Navigate to the project directory:
   ```bash
   cd field-services-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env.development
   ```

4. Update environment variables in `.env.development` as needed.

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Building

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Code Quality

### Linting

The project uses ESLint with TypeScript support. Run linting:

```bash
npm run lint
```

Auto-fix issues:

```bash
npm run lint:fix
```

### Formatting

The project uses Prettier for consistent code formatting:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## Environment Configuration

The application uses environment variables for configuration. Create environment-specific files:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.example` - Example template

### Available Environment Variables

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Service URLs
VITE_WORK_ORDER_SERVICE_URL=http://localhost:8082/api/v1
VITE_USER_SERVICE_URL=http://localhost:8081/api/v1
VITE_RESOURCE_SERVICE_URL=http://localhost:8083/api/v1

# Application Configuration
VITE_APP_NAME=Field Services Management
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Backend Integration

The application is configured to integrate with the Field Services microservices backend. The API service layer (`src/services/api.service.ts`) provides methods for HTTP communication.

### Using the API Service

```typescript
import { apiService } from './services/api.service';

// GET request
const data = await apiService.get('/work-orders');

// POST request
const newOrder = await apiService.post('/work-orders', { 
  title: 'New Work Order',
  status: 'PENDING'
});

// PUT request
await apiService.put('/work-orders/1', { status: 'COMPLETED' });

// DELETE request
await apiService.delete('/work-orders/1');
```

### Using the useApi Hook

```typescript
import { useApi } from './hooks/useApi';
import { apiService } from './services/api.service';

function WorkOrders() {
  const { data, loading, error, execute } = useApi(() => 
    apiService.get('/work-orders')
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## Component Development

### Creating Components

Components follow a consistent pattern:

```typescript
/**
 * ComponentName
 * Brief description
 */

interface ComponentProps {
  // Define props
}

export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Component Categories

- **Common Components** (`src/components/common/`) - Reusable UI elements like buttons, inputs, cards
- **Layout Components** (`src/components/layout/`) - Layout structures like header, footer, navigation
- **Feature Components** (`src/components/features/`) - Feature-specific components

## Best Practices

1. **TypeScript** - Use TypeScript for all new code
2. **Props Interface** - Define interfaces for component props
3. **File Organization** - Keep related files together
4. **Code Style** - Follow ESLint and Prettier rules
5. **Comments** - Add JSDoc comments for complex logic
6. **Testing** - Write tests for components and utilities (when test infrastructure is added)
7. **Imports** - Use absolute imports from `src/`
8. **Naming** - Use PascalCase for components, camelCase for functions

## Contributing

Please follow the project's coding standards and contribution guidelines as defined in the main repository's [CONTRIBUTING.md](../CONTRIBUTING.md).

## License

This project is part of the Field Services Management System. See the main repository for license information.
