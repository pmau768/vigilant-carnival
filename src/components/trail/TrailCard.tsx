import React from 'react';
import { MapPin, Clock, Route, ArrowUpRight, Share2, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { TrailSuggestion } from '../../types';
import { motion } from 'framer-motion';

interface TrailCardProps {
  trail: TrailSuggestion;
  onSelectTrail?: (trail: TrailSuggestion) => void;
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, onSelectTrail }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const [isLiked, setIsLiked] = React.useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would implement actual sharing functionality
    alert(`Sharing trail: ${trail.name}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Card 
      variant="elevated" 
      className="h-full cursor-pointer overflow-hidden dark:border dark:border-gray-700"
      onClick={() => onSelectTrail && onSelectTrail(trail)}
      hover
    >
      {trail.imageUrl && (
        <div className="h-48 relative overflow-hidden rounded-t-xl">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={trail.imageUrl}
            alt={trail.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[trail.difficulty]}`}>
            {trail.difficulty}
          </div>
        </div>
      )}
      
      <CardHeader className="pt-5">
        <CardTitle className="text-xl text-emerald-800 dark:text-amber-500">{trail.name}</CardTitle>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{trail.location}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center">
            <Route className="h-4 w-4 mr-1 text-emerald-600 dark:text-amber-500" />
            <span>{trail.length} miles</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-emerald-600 dark:text-amber-500" />
            <span>~{Math.round(trail.length * 30)} mins</span>
          </div>
          {trail.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{trail.rating.toFixed(1)}</span>
              {trail.reviews && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({trail.reviews})</span>}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{trail.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {trail.petFriendlyFeatures.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-sky-50 dark:bg-blue-900 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {feature}
            </span>
          ))}
          {trail.petFriendlyFeatures.length > 3 && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-medium">
              +{trail.petFriendlyFeatures.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button 
          variant="primary" 
          size="sm"
          icon={<ArrowUpRight className="h-4 w-4" />}
        >
          View Details
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />}
            onClick={handleLike}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Share2 className="h-4 w-4" />}
            onClick={handleShare}
            aria-label="Share trail"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrailCard;