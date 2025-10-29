# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application that fetches a list of vendors, displays them in alphabetical order by merchant name, and allows users to click on a vendor to view its transactions. The application includes features like loading states, error handling, and transaction formatting.

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

The frontend runs on `http://localhost:4200` and the backend API server runs on `http://localhost:3000`.

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

- **Mock API**: A local Express server provides mock vendor data
- **React Query**: Used to fetch and cache API responses

### Key Directories

- `src/api/`: Contains API client code and mock responses
- `src/components/`: React components for UI elements
- `src/hooks/`: Custom React hooks (includes `useVendors` for data fetching)
- `src/interfaces/`: TypeScript interfaces for data models

### Data Flow

1. The application uses React Query to fetch vendor data from the API
2. Vendors are displayed in alphabetical order by merchant_name
3. When a vendor is clicked, its transactions are displayed
4. Transaction data is formatted according to requirements (dollar sign prefix, date format)

## Requirements

The application must satisfy the following requirements:

1. Fetch and display vendors with loading and error states
2. Sort vendors alphabetically by merchant_name
3. Show vendor transactions when clicked
4. Format transaction details:
   - Display account_owner, datetime, and amount
   - Format amount with dollar sign prefix
   - Format datetime as "Day Month Date Year" (e.g., "Sat Feb 10 2024")

## API Endpoints

- `/api/v1/pixels`: Returns generated pixel data (used in the Express server)
- `api.vendors.get()`: A mock API function that returns vendor data after a simulated delay

## Development Notes

- The mock data is defined in `src/api/mockResponse.ts`
- The API client interface is in `src/api/api.ts`
- The `useVendors` hook in `src/hooks/useVendors.ts` encapsulates the data fetching logic
- Interfaces for vendor and transaction data are defined in `src/interfaces/vendors.ts`