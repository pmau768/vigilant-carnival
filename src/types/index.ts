export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  energyLevel: 'Low' | 'Medium' | 'High';
  healthIssues?: string[];
  photo?: string;
  totalDistance?: number;
  totalHikes?: number;
}

export type ActivityType = 'Hike' | 'Run' | 'Walk' | 'Play' | 'Other';

export interface TrailSuggestion {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  length: number; // in miles
  description: string;
  petFriendlyFeatures: string[];
  imageUrl?: string;
  rating?: number;
  reviews?: number;
}

export interface HikeRecord {
  id: string;
  petId: string;
  trailId?: string;
  customTrailName?: string;
  date: string;
  duration: number; // in minutes
  distance: number; // in miles
  gpsData: GpsPoint[];
  photos?: string[];
  notes?: string;
  weatherConditions?: string;
  activityType?: ActivityType;
  terrain?: 'Flat' | 'Hilly' | 'Mountainous' | 'Mixed' | 'Unknown';
  elevationGain?: number;
  minElevation?: number;
  maxElevation?: number;
}

export interface GpsPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface HikeAnalysis {
  id: string;
  hikeId: string;
  petId: string;
  overview: string;
  pawHealthInsights: string;
  restStopRecommendations: string;
  futureSuggestions: string;
  energyExpenditureEstimate: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  trailName: string;
  description: string;
  imageUrl?: string;
  mapPreview?: string;
  likes: number;
  comments: number;
  createdAt: string;
}