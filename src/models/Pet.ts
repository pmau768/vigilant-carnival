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