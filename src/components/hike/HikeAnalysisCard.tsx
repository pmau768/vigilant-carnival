import React from 'react';
import { format } from 'date-fns';
import { File, LightbulbIcon, Heart, ArrowRight, Share2, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { HikeAnalysis, Pet } from '../../types';

interface HikeAnalysisCardProps {
  analysis: HikeAnalysis;
  pet: Pet;
  onShare?: () => void;
}

const HikeAnalysisCard: React.FC<HikeAnalysisCardProps> = ({ analysis, pet, onShare }) => {
  const formattedDate = format(new Date(analysis.timestamp), 'MMMM d, yyyy');

  return (
    <Card variant="elevated" className="overflow-hidden dark:border dark:border-gray-700">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-amber-700 dark:to-amber-600 py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <File className="h-5 w-5 text-white mr-2" />
            <CardTitle className="text-white">Activity Analysis</CardTitle>
          </div>
          <span className="text-xs text-emerald-100 dark:text-amber-100">{formattedDate}</span>
        </div>
        <p className="text-emerald-100 dark:text-amber-100 text-sm mt-1">
          Personalized insights for {pet.name}
        </p>
      </div>
      
      <CardContent className="pt-6 space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Overview</h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.overview}</p>
        </section>
        
        <section className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-600">
          <div className="flex items-start mb-2">
            <LightbulbIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-0.5" />
            <h3 className="text-md font-semibold text-yellow-700 dark:text-yellow-400">Energy Expenditure</h3>
          </div>
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">{analysis.energyExpenditureEstimate}</p>
        </section>
        
        <section className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400 dark:border-red-500">
          <div className="flex items-start mb-2">
            <Heart className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
            <h3 className="text-md font-semibold text-red-700 dark:text-red-400">Paw Health Insights</h3>
          </div>
          <p className="text-red-800 dark:text-red-300 text-sm">{analysis.pawHealthInsights}</p>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Rest Stop Recommendations</h3>
          <p className="text-gray-700 dark:text-gray-300">{analysis.restStopRecommendations}</p>
        </section>
        
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400 dark:border-blue-500">
          <div className="flex items-start mb-2">
            <ArrowRight className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" />
            <h3 className="text-md font-semibold text-blue-700 dark:text-blue-400">Future Suggestions</h3>
          </div>
          <p className="text-blue-800 dark:text-blue-300 text-sm">{analysis.futureSuggestions}</p>
        </section>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button
          variant="outline"
          size="sm"
          icon={<Share2 className="h-4 w-4" />}
          onClick={onShare}
        >
          Share Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HikeAnalysisCard;