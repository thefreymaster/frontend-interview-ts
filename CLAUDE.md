# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hypothetical React coding interview starter for a 100 by 100 pixel grid and a pixel detail page. The `Pixels` and `Pixel` components, HTTP pixel fetch functions, and `usePixels` hook are intentionally empty. The Express backend supplies 10,000 pixels with RGB sub-pixel values, a pixel detail endpoint, a mock user profile, and a repeating Socket.IO quality stream. An implemented frontend socket bridge keeps React Query caches in sync without rendering the exercise UI.

Do not implement the grid, click navigation, HTTP fetching, or detail UI unless explicitly requested. Socket.IO transport and cache updates are implemented groundwork. Do not add or run tests unless requested.

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

The frontend is configured for `http://localhost:5090` and the backend API server for `http://localhost:4090`. Vite proxies `/api/v1` and `/socket.io` HTTP/WebSocket requests to the backend.

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
- **React Query**: The `usePixels` hook and HTTP fetch functions remain empty for the exercise
- **Socket.IO**: `usePixelUpdates`, mounted in `App`, applies snapshots and per-pixel quality updates to React Query caches
- **Socket provider**: `SocketIOProvider`, inside `QueryClientProvider`, owns the shared connection; `useSocketIO` exposes its socket, status, and error
- **Routes**: `/` and `/pixels` render the empty `Pixels` component; `/pixels/:id` renders the empty `Pixel` component

### Key Directories

- `src/api/`: Contains intentionally empty pixel list and detail fetch functions
- `src/components/`: React components for UI elements
- `src/hooks/`: Custom React hooks (includes `usePixels` for data fetching)
- `src/interfaces/`: Contains the shared `IPixel` data model and socket event contract
- `src/providers/`: Contains the Socket.IO connection provider and typed context

### Data Flow

1. Once implemented, `Pixels` uses `usePixels` and `api.pixels.get` to fetch the pixel list
2. The frontend displays the 10,000 returned pixels in a 100 by 100 grid
3. Clicking a pixel navigates to `/pixels/:id`
4. The detail page fetches the selected pixel using `api.pixels.getById` and displays its information
5. The implemented `usePixelUpdates` socket bridge updates the list cache and existing detail caches as quality changes

## Requirements

The interview exercise, not the current scaffold, should satisfy these requirements:

1. Implement list and detail HTTP fetching with loading and error states
2. Display a 100 by 100 pixel grid
3. Navigate to the selected pixel's detail route when clicked
4. Display the pixel ID, health, metadata, and red/green/blue sub-pixel values
5. Handle unknown pixel IDs

## API Endpoints

- `/api/v1/pixels`: Regenerates 10,000 pixels per request with sequential IDs, randomized RGB values, and exactly 94% green, 5% yellow, and 1% red
- `/api/v1/pixels/:id`: Returns the matching pixel from the current live state or a JSON 404
- `/api/v1/user`: Returns a fixed mock user profile
- `/api/v1/docs`: Serves Swagger UI
- `/api-docs.json`: Serves the OpenAPI specification
- `/socket.io`: Socket.IO HTTP/WebSocket transport for pixel events

## Development Notes

- The API client in `src/api/api.ts` exposes empty `api.pixels.get` and `api.pixels.getById` functions
- The `usePixels` hook in `src/hooks/usePixels.ts` is intentionally empty
- `usePixelUpdates` subscribes to the provider's socket, removes only its own listeners, and resynchronizes on reconnect
- `SocketIOProvider` connects and disconnects the shared socket; `useSocketIO` exposes connection status and errors
- Query keys in `src/api/pixelQueryKeys.ts` are `["PIXELS"]` and `["PIXEL", numericId]`
- The shared pixel interface is defined in `src/interfaces/pixels.ts`
- `sub_pixels.red`, `sub_pixels.green`, and `sub_pixels.blue` are integers from 0 to 255
- Every list request regenerates pixel data and shuffles the exact color distribution while keeping IDs fixed
- Green pixels have `healthy: true`; yellow and red pixels have `healthy: false`
- Every five seconds, the simulation rotates quality assignments while preserving the exact percentages; the 12-step pattern repeats every minute
- HTTP list requests reset the cycle and broadcast the new snapshot to connected clients
- Intensity and RGB values stay fixed within the cycle and are randomized on HTTP list refresh
- Detail requests use the current live state shared across clients
- `pixels:snapshot` carries `IPixel[]`; `pixel:update` carries an individual `IPixel`; `pixels:updated` marks the end of a tick
- The frontend batches cache changes at the end of each tick rather than updating the grid for each socket event
- Pixel responses set `Cache-Control: no-store`
