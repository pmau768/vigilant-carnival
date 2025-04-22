import { ActivityType, HikeRecord, Pet, HikeAnalysis } from '../types';
import { calculatePetCalorieBurn } from '../utils/activity';

/**
 * Service for generating pet-specific activity analysis
 */
export class AnalysisService {
  /**
   * Generate a detailed analysis based on the hike data and pet profile
   */
  static generateAnalysis(hike: HikeRecord, pet: Pet): HikeAnalysis {
    // Generate personalized overview
    const overview = this.generateOverviewText(hike, pet);
    
    // Generate paw health insights
    const pawHealthInsights = this.generatePawHealthInsights(hike, pet);
    
    // Generate rest stop recommendations
    const restStopRecommendations = this.generateRestStopRecommendations(hike, pet);
    
    // Generate future suggestions
    const futureSuggestions = this.generateFutureSuggestions(hike, pet);
    
    // Generate energy expenditure estimate
    const energyExpenditureEstimate = this.generateEnergyExpenditureEstimate(hike, pet);
    
    return {
      id: `analysis-${Date.now()}`,
      hikeId: hike.id,
      petId: pet.id,
      overview,
      pawHealthInsights,
      restStopRecommendations,
      futureSuggestions,
      energyExpenditureEstimate,
      timestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Generate overview text based on pet and hike data
   */
  private static generateOverviewText(hike: HikeRecord, pet: Pet): string {
    const activityType = hike.activityType?.toLowerCase() || 'hike';
    const weather = hike.weatherConditions?.toLowerCase() || 'ideal weather conditions';
    const terrain = hike.terrain?.toLowerCase() || 'varied terrain';
    const pace = Math.round(hike.duration / hike.distance);
    
    // Breed-specific insights
    const breedInsight = this.getBreedSpecificInsight(pet.breed, activityType, terrain);
    
    return `${pet.name} had a ${hike.duration}-minute ${activityType} covering ${hike.distance} miles on the ${hike.customTrailName} trail. The ${weather} provided comfortable conditions for a ${pet.breed}. ${breedInsight} The pace was moderate at about ${pace} minutes per mile, which is appropriate for a trail with ${terrain}.`;
  }
  
  /**
   * Generate breed-specific insights
   */
  private static getBreedSpecificInsight(breed: string, activity: string, terrain: string): string {
    const breedLower = breed.toLowerCase();
    
    if (breedLower.includes('retriever')) {
      return `As a retriever, your dog likely enjoyed the opportunity to explore and potentially access any water features.`;
    } else if (breedLower.includes('shepherd') || breedLower.includes('collie') || breedLower.includes('malinois')) {
      return `This ${activity} provided good mental stimulation for your herding breed, which typically needs both physical activity and mental challenges.`;
    } else if (breedLower.includes('terrier')) {
      return `Terriers typically enjoy exploring varied terrain, and this ${terrain} area provided good stimulation.`;
    } else if (breedLower.includes('bulldog') || breedLower.includes('pug') || breedLower.includes('shih tzu')) {
      return `As a brachycephalic breed, your dog's breathing should be monitored closely during activities, especially in warmer weather.`;
    } else {
      return `The ${terrain} terrain provided a good mixture of challenges and easy sections for your ${breed}.`;
    }
  }
  
  /**
   * Generate paw health insights based on terrain and weather
   */
  private static generatePawHealthInsights(hike: HikeRecord, pet: Pet): string {
    // Base advice on terrain type
    let pawAdvice = '';
    
    if (hike.terrain === 'Mountainous') {
      pawAdvice = `The rugged mountainous terrain may have put extra stress on ${pet.name}'s paw pads. Check for any cuts, abrasions, or signs of tenderness.`;
    } else if (hike.terrain === 'Hilly') {
      pawAdvice = `The hilly terrain of this trail provided a moderate challenge to ${pet.name}'s paws. Look for any debris between the pads.`;
    } else {
      pawAdvice = `The relatively flat terrain was gentle on ${pet.name}'s paws, but it's still good to check them after any activity.`;
    }
    
    // Add weather-specific advice
    const weatherLower = (hike.weatherConditions || '').toLowerCase();
    if (weatherLower.includes('hot') || weatherLower.includes('sunny')) {
      pawAdvice += ` The warm weather may have heated up walking surfaces, so ensure paws didn't get burned on any asphalt or rocks.`;
    } else if (weatherLower.includes('rain') || weatherLower.includes('wet')) {
      pawAdvice += ` The wet conditions may have softened paw pads, making them more susceptible to damage. Ensure they're thoroughly dried.`;
    }
    
    // Add health-specific advice
    if (pet.healthIssues && pet.healthIssues.length > 0) {
      const issues = pet.healthIssues.map(i => i.toLowerCase());
      
      if (issues.some(issue => issue.includes('hip') || issue.includes('joint') || issue.includes('arthritis'))) {
        pawAdvice += ` Given ${pet.name}'s joint issues, monitor for any signs of lameness or discomfort in the hours following the activity.`;
      }
    }
    
    return pawAdvice;
  }
  
  /**
   * Generate rest stop recommendations
   */
  private static generateRestStopRecommendations(hike: HikeRecord, pet: Pet): string {
    const activityType = hike.activityType || 'Hike';
    const duration = hike.duration;
    const weather = hike.weatherConditions || '';
    
    // Calculate recommended rest stops based on activity duration, type, and pet energy level
    let restStopFrequency: number;
    
    if (pet.energyLevel === 'High') {
      restStopFrequency = 30; // minutes
    } else if (pet.energyLevel === 'Medium') {
      restStopFrequency = 25; // minutes
    } else {
      restStopFrequency = 20; // minutes
    }
    
    // Adjust for activity type
    if (activityType === 'Run') {
      restStopFrequency -= 5; // More frequent for higher intensity
    } else if (activityType === 'Walk') {
      restStopFrequency += 10; // Less frequent for lower intensity
    }
    
    // Adjust for weather
    if (weather.toLowerCase().includes('hot') || weather.toLowerCase().includes('sunny')) {
      restStopFrequency -= 5; // More frequent in hot weather
    }
    
    // Calculate recommended total rest stops
    const recommendedStops = Math.ceil(duration / restStopFrequency);
    
    let recommendationText = `For a ${pet.breed} like ${pet.name} on a ${activityType.toLowerCase()} of this length, ${recommendedStops} rest stops would be ideal.`;
    
    // Add weather-specific advice
    if (weather.toLowerCase().includes('hot') || weather.toLowerCase().includes('sunny')) {
      recommendationText += ` In warm weather, ensure water breaks every ${restStopFrequency} minutes to prevent dehydration.`;
    } else if (weather.toLowerCase().includes('rain')) {
      recommendationText += ` During wet conditions, find sheltered areas for rest stops to keep ${pet.name} from getting too chilled.`;
    }
    
    // Add breed-specific advice
    if (pet.breed.toLowerCase().includes('retriever') || pet.breed.toLowerCase().includes('lab')) {
      recommendationText += ` ${pet.name} would appreciate rest stops near water for a quick dip to cool off.`;
    } else if (pet.breed.toLowerCase().includes('shepherd') || pet.breed.toLowerCase().includes('collie')) {
      recommendationText += ` Include some mental stimulation during rest stops, like simple training exercises, to keep ${pet.name} engaged.`;
    }
    
    return recommendationText;
  }
  
  /**
   * Generate future activity suggestions
   */
  private static generateFutureSuggestions(hike: HikeRecord, pet: Pet): string {
    const activityType = hike.activityType || 'Hike';
    const distance = hike.distance;
    const terrain = hike.terrain || 'varied';
    
    // Calculate progressive distance increases based on pet energy and current performance
    const progressiveFactor = pet.energyLevel === 'High' ? 1.2 : (pet.energyLevel === 'Medium' ? 1.1 : 1.05);
    const suggestedNextDistance = +(distance * progressiveFactor).toFixed(1);
    const suggestedLongerDistance = +(distance * progressiveFactor * progressiveFactor).toFixed(1);
    
    let suggestions = `Based on ${pet.name}'s performance on this ${activityType.toLowerCase()}, you could gradually increase distance to ${suggestedNextDistance}-${suggestedLongerDistance} miles on similar ${terrain} terrain.`;
    
    // Add activity variation suggestions
    if (activityType === 'Hike') {
      suggestions += ` Consider mixing in some shorter, more intense runs or longer, leisurely walks to provide variety in ${pet.name}'s exercise routine.`;
    } else if (activityType === 'Run') {
      suggestions += ` Balance these high-intensity workouts with longer, more relaxed hikes to give ${pet.name} a mix of cardio and exploratory activities.`;
    } else if (activityType === 'Walk') {
      suggestions += ` For a ${pet.breed} with ${pet.energyLevel.toLowerCase()} energy, consider challenging ${pet.name} with occasional hikes on more varied terrain.`;
    }
    
    // Add health-specific advice
    if (pet.healthIssues && pet.healthIssues.length > 0) {
      const issues = pet.healthIssues.map(i => i.toLowerCase());
      
      if (issues.some(issue => issue.includes('hip') || issue.includes('joint') || issue.includes('arthritis'))) {
        suggestions += ` Considering ${pet.name}'s joint issues, continue to favor natural surfaces rather than paved paths, and consider alternate exercises like swimming that are easier on the joints.`;
      }
    }
    
    return suggestions;
  }
  
  /**
   * Generate energy expenditure estimate
   */
  private static generateEnergyExpenditureEstimate(hike: HikeRecord, pet: Pet): string {
    // Calculate calorie burn based on pet weight, activity type, and distance
    const { min: minCalories, max: maxCalories } = calculatePetCalorieBurn(
      pet.weight, 
      pet.energyLevel, 
      hike.distance,
      hike.activityType || 'Hike'
    );
    
    // Calculate this as percentage of daily energy needs (roughly 30 calories per lb for active dogs)
    const dailyCalories = pet.weight * 30;
    const percentOfDaily = Math.round((minCalories + maxCalories) / 2 / dailyCalories * 100);
    
    let calorieText = `This ${hike.activityType?.toLowerCase() || 'activity'} likely burned approximately ${minCalories}-${maxCalories} calories for ${pet.name}, which is about ${percentOfDaily}% of a ${pet.weight}lb ${pet.breed}'s daily energy needs.`;
    
    // Add terrain-specific insights
    if (hike.terrain === 'Mountainous' || hike.elevationGain && hike.elevationGain > 500) {
      calorieText += ` The significant elevation gain (${hike.elevationGain}ft) increased the energy expenditure beyond what a flat-terrain activity would require.`;
    }
    
    // Add feeding advice
    if (percentOfDaily > 30) {
      calorieText += ` Consider a slightly larger meal for ${pet.name} today to replenish energy stores, especially focusing on protein to aid recovery.`;
    } else if (percentOfDaily > 15) {
      calorieText += ` This represented a moderate energy expenditure, and regular feeding should be sufficient for recovery.`;
    } else {
      calorieText += ` This was a relatively light activity for ${pet.name} and doesn't require any adjustment to regular feeding amounts.`;
    }
    
    return calorieText;
  }
}