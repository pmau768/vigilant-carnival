import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, PawPrint, Map, Search, Send, Camera, Heart, MessageCircle, Share, Filter, Bookmark, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import TrailCard from '../components/trail/TrailCard';
import { Pet, TrailSuggestion, CommunityPost } from '../types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Tab type definition
type ExploreTab = 'community' | 'adventures';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ExploreTab>('community');
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [suggestedTrails, setSuggestedTrails] = useState<TrailSuggestion[]>([]);
  const [nearbyTrails, setNearbyTrails] = useState<TrailSuggestion[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock pet data
  const mockPet: Pet = {
    id: '1',
    name: 'Max',
    breed: 'Belgian Malinois',
    age: 5,
    weight: 65,
    energyLevel: 'High',
    photo: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=1600',
    totalDistance: 45,
    totalHikes: 12
  };
  
  // Mock trail data
  const mockSuggestedTrails: TrailSuggestion[] = [
    {
      id: '1',
      name: 'Forest Park Loop',
      location: 'Portland, OR',
      difficulty: 'Moderate',
      length: 3.5,
      description: 'A beautiful forested trail with moderate elevation gain and plenty of shade.',
      petFriendlyFeatures: ['Off-leash areas', 'Water access', 'Forested Terrain'],
      imageUrl: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.8,
      reviews: 42
    },
    {
      id: '2',
      name: 'Riverfront Trail',
      location: 'Seattle, WA',
      difficulty: 'Easy',
      length: 2.1,
      description: 'Flat paved trail along the riverfront with great views and wildlife.',
      petFriendlyFeatures: ['Paved path', 'Flat Terrain', 'Water fountains'],
      imageUrl: 'https://images.pexels.com/photos/3551207/pexels-photo-3551207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.5,
      reviews: 28
    }
  ];
  
  const mockNearbyTrails: TrailSuggestion[] = [
    {
      id: '3',
      name: 'Mountain Vista Trail',
      location: 'Nearby (3.2 miles)',
      difficulty: 'Hard',
      length: 4.8,
      description: 'Challenging trail with spectacular mountain views and wildlife.',
      petFriendlyFeatures: ['Wildlife viewing', 'Mountainous Terrain', 'Shaded areas'],
      imageUrl: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.9,
      reviews: 65
    },
    {
      id: '4',
      name: 'Lakeside Loop',
      location: 'Nearby (4.5 miles)',
      difficulty: 'Easy',
      length: 1.8,
      description: 'Scenic loop around the lake with multiple swimming spots for dogs.',
      petFriendlyFeatures: ['Swimming areas', 'Flat Terrain', 'Off-leash permitted'],
      imageUrl: 'https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.7,
      reviews: 36
    }
  ];
  
  // Mock community posts
  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Jessica K.',
      userPhoto: 'https://images.pexels.com/photos/3770254/pexels-photo-3770254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Pine Ridge Trail',
      description: 'Beautiful day out with Luna! She loved all the new smells and we even saw a deer. 🐕 🦌',
      imageUrl: 'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      mapPreview: 'https://example.com/map1.jpg',
      likes: 24,
      comments: 3,
      createdAt: '2023-04-15T18:30:00Z'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'David M.',
      userPhoto: 'https://images.pexels.com/photos/3778680/pexels-photo-3778680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Coastal Walk',
      description: 'First time at the beach for Bailey and he absolutely loved it! Anyone know any other good dog beaches in the area?',
      imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      likes: 18,
      comments: 5,
      createdAt: '2023-04-14T14:15:00Z'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Sophia L.',
      userPhoto: 'https://images.pexels.com/photos/4350057/pexels-photo-4350057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'River Run Trail',
      description: 'Max got so muddy on our hike today! Anyone have recommendations for good dog shampoo for a German Shepherd?',
      imageUrl: 'https://images.pexels.com/photos/1144410/pexels-photo-1144410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      likes: 32,
      comments: 8,
      createdAt: '2023-04-13T10:20:00Z'
    }
  ];
  
  useEffect(() => {
    // In a real app, this would fetch data from the API
    setCurrentPet(mockPet);
    setSuggestedTrails(mockSuggestedTrails);
    setNearbyTrails(mockNearbyTrails);
    setPosts(mockPosts);
  }, []);
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    
    // In a real app, this would send the post to a server
    const newPost: CommunityPost = {
      id: `new-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userPhoto: mockPet.photo,
      trailName: 'Your Location',
      description: newPostText,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
    toast.success('Your post has been shared with the community!');
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };
  
  const handleSelectTrail = (trail: TrailSuggestion) => {
    // In a real app, this would navigate to a trail details page
    navigate('/trails-and-record', { state: { selectedTrail: trail } });
  };
  
  const filteredCommunityPosts = searchQuery 
    ? posts.filter(post => 
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.trailName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;
    
  const filteredTrails = searchQuery
    ? [...suggestedTrails, ...nearbyTrails].filter(trail =>
        trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [...suggestedTrails, ...nearbyTrails];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title="Explore" 
        rightContent={
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setSearchQuery('')}
            >
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => navigate(activeTab === 'community' ? '/community' : '/adventures')}
            >
              <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        }
      />
      
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto">
          <div className="flex">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'community'
                  ? 'border-emerald-500 dark:border-amber-500 text-emerald-600 dark:text-amber-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('community')}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Community
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'adventures'
                  ? 'border-emerald-500 dark:border-amber-500 text-emerald-600 dark:text-amber-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('adventures')}
            >
              <Compass className="h-4 w-4 inline mr-2" />
              Adventures
            </button>
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'community' ? "Search community posts..." : "Search trails..."}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-3">
        {activeTab === 'community' ? (
          /* Community Feed */
          <div className="space-y-4">
            {/* New Post Card */}
            <Card className="shadow-sm dark:border dark:border-gray-700">
              <CardContent className="p-4">
                <form onSubmit={handlePostSubmit}>
                  <div className="flex items-start space-x-3">
                    {currentPet?.photo ? (
                      <img 
                        src={currentPet.photo} 
                        alt="Your pet"
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                        <PawPrint className="h-5 w-5 text-emerald-600 dark:text-amber-500" />
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <textarea
                        placeholder="Share your pet's adventure..."
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white text-sm"
                        rows={3}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        required
                      />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<MapPin className="h-4 w-4" />}
                            type="button"
                          >
                            Trail
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<Camera className="h-4 w-4" />}
                            type="button"
                          >
                            Photo
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<PawPrint className="h-4 w-4" />}
                            type="button"
                          >
                            Pet
                          </Button>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          icon={<Send className="h-4 w-4" />}
                          disabled={!newPostText.trim()}
                          type="submit"
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Filter options or recommendations can go here */}
            
            {/* Posts */}
            {filteredCommunityPosts.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <PawPrint className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try a different search or be the first to share!</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    title="Clear search query"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              filteredCommunityPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-sm dark:border dark:border-gray-700">
                    <CardContent className="p-0">
                      {/* Post header */}
                      <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        {post.userPhoto ? (
                          <img
                            src={post.userPhoto}
                            alt={post.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                            <Users className="h-5 w-5 text-emerald-600 dark:text-amber-500" />
                          </div>
                        )}
                        
                        <div className="ml-3">
                          <div className="font-medium text-gray-900 dark:text-white">{post.userName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.trailName}
                          </div>
                        </div>
                      </div>
                      
                      {/* Post content */}
                      <div className="p-4">
                        <p className="text-gray-800 dark:text-gray-200 mb-3">{post.description}</p>
                        
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-lg mb-3"
                          />
                        )}
                      </div>
                      
                      {/* Post actions */}
                      <div className="flex items-center px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                        <button 
                          className="flex items-center mr-6"
                          onClick={() => handleLikePost(post.id)}
                          aria-label={`Like post - ${post.likes} likes`}
                          title={`Like post - ${post.likes} likes`}
                        >
                          <Heart className="h-5 w-5 mr-1" />
                          <span>{post.likes}</span>
                        </button>
                        <button 
                          className="flex items-center mr-6"
                          aria-label={`View comments - ${post.comments} comments`}
                          title={`View comments - ${post.comments} comments`}
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          <span>{post.comments}</span>
                        </button>
                        <button 
                          className="flex items-center ml-auto"
                          aria-label="Share post"
                          title="Share post"
                        >
                          <Share className="h-5 w-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* Adventures Tab */
          <div className="space-y-6">
            {/* Quick Actions - Move these above the hero section */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => navigate('/trails-and-record')}
                className="bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                icon={<MapPin className="h-5 w-5 text-emerald-600 dark:text-amber-500" />}
              >
                Find Trails
              </Button>
              <Button 
                onClick={() => navigate('/trails-and-record')}
                className="bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                icon={<Map className="h-5 w-5 text-emerald-600 dark:text-amber-500" />}
              >
                Record Activity
              </Button>
            </div>
            
            {/* If there's a current pet, show recommendations */}
            {currentPet && filteredTrails.length > 0 && !searchQuery && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Recommended for {currentPet.name}
                </h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:border dark:border-gray-700">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        {currentPet.photo ? (
                          <img 
                            src={currentPet.photo}
                            alt={currentPet.name}
                            className="h-14 w-14 rounded-full object-cover border-2 border-emerald-100 dark:border-gray-700"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                            <PawPrint className="h-6 w-6 text-emerald-600 dark:text-amber-500" />
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{currentPet.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{currentPet.breed} • {currentPet.energyLevel} Energy</p>
                        </div>
                      </div>
                      
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Based on {currentPet.name}'s {currentPet.energyLevel.toLowerCase()} energy level, we've found these trails that would be perfect:
                        </p>
                        
                        <div className="space-y-3 mt-2">
                          {suggestedTrails.slice(0, 2).map(trail => (
                            <div 
                              key={trail.id}
                              className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg cursor-pointer"
                              onClick={() => handleSelectTrail(trail)}
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-md bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center mr-3">
                                  <MapPin className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-emerald-900 dark:text-emerald-300">{trail.name}</h4>
                                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                    {trail.difficulty} • {trail.length} miles • {trail.location}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
            
            {/* Nearby Trails */}
            {nearbyTrails.length > 0 && !searchQuery && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Nearby Trails</h2>
                <div className="space-y-4">
                  {nearbyTrails.map((trail) => (
                    <motion.div 
                      key={trail.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrailCard
                        trail={trail}
                        onSelectTrail={handleSelectTrail}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search Results */}
            {searchQuery && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {filteredTrails.length === 0 ? 'No trails found' : 'Search Results'}
                </h2>
                {filteredTrails.length === 0 ? (
                  <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <MapPin className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No trails match your search</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Try different search terms or filters</p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      title="Clear search query"
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTrails.map((trail) => (
                      <motion.div 
                        key={trail.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TrailCard
                          trail={trail}
                          onSelectTrail={handleSelectTrail}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Suggested Popular Trails */}
            {suggestedTrails.length > 0 && !searchQuery && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Popular Trails</h2>
                <div className="space-y-4">
                  {suggestedTrails.map((trail) => (
                    <motion.div 
                      key={trail.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrailCard
                        trail={trail}
                        onSelectTrail={handleSelectTrail}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage; 