# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hypothetical React coding interview starter for a 100 by 100 pixel grid and a pixel detail page. The `Pixels` and `Pixel` components and pixel fetch functions are intentionally empty. The Express backend supplies 10,000 pixels with RGB sub-pixel values, a pixel detail endpoint, and a mock user profile.

Do not implement the grid, click navigation, frontend fetching, or detail UI unless explicitly requested. The current scope is scaffolding only. Do not add or run tests unless requested.

## Development Commands

### Setup and Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server (Frontend - Vite)
npm run dev

# Start the mock API server (Backend - Express)
npm run server
```

The frontend is configured for `http://localhost:5090` and the backend API server for `http://localhost:4090`. Vite proxies `/api/v1` requests to the backend.

### Building the Application

```bash
# Build for production
npm run build
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Architecture

The application follows a standard React architecture with the following key components:

### Frontend Structure

- **React + TypeScript**: The frontend is built with React and TypeScript
- **Vite**: Used as the build tool and development server
- **React Query**: Handles data fetching, caching, and state management
- **Styled Components**: Used for component styling

### API Communication

- **Mock API**: A local TypeScript Express server provides pixel list/detail data and a user profile
- **React Query**: The provided `usePixels` hook calls the empty frontend list fetch function
- **Routes**: `/` and `/pixels` render the empty `Pixels` component; `/pixels/:id` renders the empty `Pixel` component

### Key Directories

- `src/api/`: Contains intentionally empty pixel list and detail fetch functions
- `src/components/`: React components for UI elements
- `src/hooks/`: Custom React hooks (includes `usePixels` for data fetching)
- `src/interfaces/`: Contains the shared `IPixel` data model

### Data Flow

1. Once implemented, `Pixels` uses `usePixels` and `api.pixels.get` to fetch the pixel list
2. The frontend displays the 10,000 returned pixels in a 100 by 100 grid
3. Clicking a pixel navigates to `/pixels/:id`
4. The detail page fetches the selected pixel using `api.pixels.getById` and displays its information

## Requirements

The interview exercise, not the current scaffold, should satisfy these requirements:

1. Implement list and detail HTTP fetching with loading and error states
2. Display a 100 by 100 pixel grid
3. Navigate to the selected pixel's detail route when clicked
4. Display the pixel ID, health, metadata, and red/green/blue sub-pixel values
5. Handle unknown pixel IDs

## API Endpoints

- `/api/v1/pixels`: Returns 10,000 generated pixels with sequential IDs and RGB values
- `/api/v1/pixels/:id`: Returns the matching pixel or a JSON 404
- `/api/v1/user`: Returns a fixed mock user profile
- `/api/v1/docs`: Serves Swagger UI
- `/api-docs.json`: Serves the OpenAPI specification

## Development Notes

- The API client in `src/api/api.ts` exposes empty `api.pixels.get` and `api.pixels.getById` functions
- The `usePixels` hook in `src/hooks/usePixels.ts` provides the list query scaffolding
- The shared pixel interface is defined in `src/interfaces/pixels.ts`
- `sub_pixels.red`, `sub_pixels.green`, and `sub_pixels.blue` are integers from 0 to 255
- Pixel data is generated once at server startup so list and detail responses agree until restart
