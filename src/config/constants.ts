// Application constants

export const APP_NAME = 'PawTrails';

// API and service configuration
export const API_BASE_URL = '/api';
export const API_TIMEOUT = 30000;

// Feature flags
export const FEATURES = {
  OFFLINE_SUPPORT: true,
  ANALYTICS: false,
  NOTIFICATIONS: false,
};

// Theme configuration
export const THEME = {
  PRIMARY_COLOR: 'emerald',
  DARK_MODE_PRIMARY: 'amber',
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-200',
  },
};

// Activity types and their display info
export const ACTIVITY_TYPES = {
  HIKE: {
    id: 'Hike',
    label: 'Hike',
    color: 'emerald',
    darkColor: 'emerald',
  },
  WALK: {
    id: 'Walk',
    label: 'Walk',
    color: 'blue',
    darkColor: 'blue',
  },
  RUN: {
    id: 'Run',
    label: 'Run',
    color: 'red',
    darkColor: 'red',
  },
  PLAY: {
    id: 'Play',
    label: 'Play',
    color: 'purple',
    darkColor: 'purple',
  },
};

// Terrain types and their display info
export const TERRAIN_TYPES = {
  FLAT: {
    id: 'Flat',
    label: 'Flat',
  },
  HILLY: {
    id: 'Hilly',
    label: 'Hilly',
  },
  MOUNTAINOUS: {
    id: 'Mountainous',
    label: 'Mountainous',
  },
  MIXED: {
    id: 'Mixed',
    label: 'Mixed',
  },
};

// Number of milliseconds to wait between GPS updates
export const GPS_UPDATE_INTERVAL = 5000;

// Maximum number of GPS points to store per activity
export const MAX_GPS_POINTS = 1000;

// Weather conditions for mock data
export const MOCK_WEATHER_CONDITIONS = [
  'Sunny, 72°F',
  'Partly Cloudy, 68°F',
  'Overcast, 65°F',
  'Light Rain, 62°F',
  'Clear, 70°F',
];

// Sample locations for mock data
export const MOCK_LOCATIONS = {
  TYPES: ['Park', 'Trail', 'Forest', 'Lake', 'Mountain', 'River', 'Creek'],
  ADJECTIVES: ['Beautiful', 'Scenic', 'Peaceful', 'Sunny', 'Quiet', 'Hidden'],
};