# PawTrails Source Code

This directory contains the source code for the PawTrails application, a pet activity tracking application.

## Directory Structure

### Components

- `components/` - Reusable UI components
  - `community/` - Components related to community features
  - `hike/` - Components related to hike tracking
  - `layout/` - Layout components (Navbar, Footer, TabBar, etc.)
  - `pet/` - Components related to pet profiles
  - `trail/` - Components related to trails
  - `ui/` - Base UI components (Button, Card, etc.)

### Pages

- `pages/` - Application pages
  - `activity/` - Activity tracking and analysis pages
  - `community/` - Community and social pages
  - `pet/` - Pet profile and management pages
  - `trail/` - Trail exploration and detail pages

### Services and Hooks

- `services/` - Service classes for data handling
  - `LocalStorageService.ts` - Service for localStorage operations
  - `HikeStorageService.ts` - Service for hike data management
  - `AnalysisService.ts` - Service for activity analysis
  - `GeolocationService.ts` - Service for geolocation operations
  - `api.ts` - API service for backend communication

- `hooks/` - React hooks for various features
  - Activity-related hooks: `useActivityDetection`, `useGeolocation`, etc.
  - Pet-related hooks: `usePet`, `usePets`, etc.
  - Trail-related hooks: `useTrails`, `useFavoriteTrails`, etc.

### Other Directories

- `context/` - React context providers
- `config/` - Application configuration
- `models/` - Data models
- `types/` - TypeScript type definitions
- `utils/` - Utility functions

## Import Structure

For easier imports, use the barrel exports from each directory:

```typescript
// Import from pages
import { HomePage, ProfileTabPage } from './pages';
import { RecordHikePage } from './pages/activity';

// Import from components
import { Button, Card } from './components/ui';
import { Navbar, Footer } from './components/layout';

// Import from services
import { LocalStorageService, HikeStorageService } from './services';

// Import from hooks
import { useGeolocation, useHikeData } from './hooks';
```

## Main Application Files

- `App.tsx` - The main application component
- `main.tsx` - Application entry point
- `index.css` - Global CSS styles 