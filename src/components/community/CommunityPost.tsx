import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { CommunityPost as CommunityPostType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface CommunityPostProps {
  post: CommunityPostType;
}

const CommunityPost: React.FC<CommunityPostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  return (
    <Card variant="outline" className="overflow-hidden dark:border-gray-700">
      <CardContent className="p-0">
        <div className="p-4">
          {/* User info and post header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {post.userPhoto ? (
                <img 
                  src={post.userPhoto} 
                  alt={post.userName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center text-emerald-600 dark:text-amber-500 font-semibold">
                  {post.userName.charAt(0)}
                </div>
              )}
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">{post.userName}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{post.trailName}</span>
                  <span className="mx-1.5">•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          
          {/* Post content */}
          <p className="text-gray-700 dark:text-gray-300 mb-3">{post.description}</p>
        </div>
        
        {/* Map preview or image */}
        {(post.mapPreview || post.imageUrl) && (
          <div className="aspect-[3/2] bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <img 
              src={post.mapPreview || post.imageUrl} 
              alt="Hike visual" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Post actions */}
        <div className="px-4 py-3 flex border-t border-gray-100 dark:border-gray-700">
          <motion.button 
            whileTap={{ scale: 1.2 }}
            className={`flex items-center mr-6 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 mr-1.5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span>{isLiked ? post.likes + 1 : post.likes}</span>
          </motion.button>
          <button className="flex items-center mr-6 text-gray-600 dark:text-gray-400">
            <MessageCircle className="h-5 w-5 mr-1.5" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center text-gray-600 dark:text-gray-400">
            <Share2 className="h-5 w-5 mr-1.5" />
            <span>Share</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPost;