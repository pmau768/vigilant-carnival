import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Camera, PawPrint, Send } from 'lucide-react';
import CommunityPost from '../components/community/CommunityPost';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CommunityPost as CommunityPostType } from '../types';
import { motion } from 'framer-motion';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [newPostText, setNewPostText] = useState('');
  
  // Mock data for community posts
  const mockPosts: CommunityPostType[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Jess',
      userPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Canyon Edge Trail',
      description: 'Just completed this amazing trail with Bailey! The views were breathtaking and she loved playing in the creek.',
      mapPreview: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      likes: 24,
      comments: 5,
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Max',
      userPhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Black Creek Loop',
      description: 'Found this hidden gem today! Extremely dog-friendly with lots of shade and water spots. Highly recommend for hot days.',
      imageUrl: 'https://images.pexels.com/photos/1790446/pexels-photo-1790446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      likes: 18,
      comments: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Bailey',
      userPhoto: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Seaside Path',
      description: 'Perfect evening walk along the coast. Gentle terrain, great for senior dogs or puppies. Saw dolphins!',
      imageUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      likes: 35,
      comments: 7,
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];
  
  useEffect(() => {
    // In a real app, this would fetch posts from the API
    setPosts(mockPosts);
  }, []);
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostText.trim()) return;
    
    // Create a new post
    const newPost: CommunityPostType = {
      id: (posts.length + 1).toString(),
      userId: 'currentUser',
      userName: 'You',
      userPhoto: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      trailName: 'Your Trail',
      description: newPostText,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    // Add it to the list of posts
    setPosts([newPost, ...posts]);
    
    // Clear the input
    setNewPostText('');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Share your hiking experiences and discover trails explored by others.
        </p>
      </div>
      
      {/* Post creation card */}
      <Card className="mb-6 dark:border-gray-700">
        <CardContent className="p-4">
          <form onSubmit={handlePostSubmit}>
            <div className="flex items-start">
              <img 
                src="https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Your profile" 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="flex-1">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share your hiking experience..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
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
                      Tag Pet
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
      
      {/* Filter options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:border dark:border-gray-700 p-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">
            All Posts
          </Button>
          <Button variant="outline" size="sm">
            Friends
          </Button>
          <Button variant="outline" size="sm">
            Nearby
          </Button>
          <Button variant="outline" size="sm">
            Popular
          </Button>
          <div className="ml-auto relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Posts feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommunityPost post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;