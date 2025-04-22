import React from 'react';
import { Edit, Trash2, PawPrint, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Pet } from '../../types';
import { motion } from 'framer-motion';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (petId: string) => void;
  onSelect: (pet: Pet) => void;
  compact?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onDelete, onSelect, compact = false }) => {
  const energyLevelColors = {
    Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    High: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };

  // If compact mode is enabled, show a simplified card for mobile
  if (compact) {
    return (
      <Card 
        variant="elevated" 
        className="dark:border dark:border-gray-700 overflow-hidden"
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-emerald-100 dark:border-gray-700"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                  <PawPrint className="h-8 w-8 text-emerald-600 dark:text-amber-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {pet.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pet.breed} • {pet.age} yr • {pet.weight} lbs
              </p>
              
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${energyLevelColors[pet.energyLevel]}`}>
                  {pet.energyLevel} Energy
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit className="h-4 w-4" />}
              onClick={(e) => { 
                e.stopPropagation(); 
                onEdit(pet); 
              }}
              aria-label={`Edit ${pet.name}'s profile`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-md py-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
              <div className="font-semibold text-emerald-600 dark:text-amber-500">
                {pet.totalDistance || 0} mi
              </div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-md py-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Activities</div>
              <div className="font-semibold text-emerald-600 dark:text-amber-500">
                {pet.totalHikes || 0}
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <Button 
              variant="text" 
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(pet.id);
              }}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label={`Delete ${pet.name}'s profile`}
            >
              Delete
            </Button>
            
            <Button 
              variant="primary" 
              size="sm"
              icon={<MapPin className="h-4 w-4" />}
              onClick={() => onSelect(pet)}
            >
              Find Trails
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full-size card for desktop layout
  return (
    <Card variant="elevated" className="h-full transition-all hover:shadow-lg overflow-hidden dark:border dark:border-gray-700" hover>
      <div className="relative pb-2/3">
        {pet.photo ? (
          <div className="h-48 overflow-hidden rounded-t-xl">
            <img
              src={pet.photo}
              alt={`${pet.name} the ${pet.breed}`}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center rounded-t-xl">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <PawPrint className="h-20 w-20 text-white" />
            </motion.div>
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl text-center">{pet.name}</CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400">{pet.breed} • {pet.age} yr • {pet.weight} lbs</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance</div>
            <div className="font-bold text-emerald-600 dark:text-amber-500">{pet.totalDistance || 0} mi</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hikes</div>
            <div className="font-bold text-emerald-600 dark:text-amber-500">{pet.totalHikes || 0}</div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${energyLevelColors[pet.energyLevel]}`}>
            {pet.energyLevel} Energy
          </span>
        </div>
        
        {pet.healthIssues && pet.healthIssues.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Health Considerations</h4>
            <div className="flex flex-wrap gap-1.5">
              {pet.healthIssues.map((issue, index) => (
                <span
                  key={index}
                  className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full text-xs"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(pet)}
            aria-label={`Edit ${pet.name}'s profile`}
          />
          <Button
            variant="outline"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(pet.id)}
            aria-label={`Delete ${pet.name}'s profile`}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          />
        </div>
        
        <Button 
          variant="primary" 
          size="sm"
          icon={<MapPin className="h-4 w-4" />}
          onClick={() => onSelect(pet)}
        >
          Find Trails
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;