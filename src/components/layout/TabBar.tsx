import React from 'react';
import { Users, User, MapPin } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { 
      path: '/community', 
      label: 'Community', 
      icon: <Users className="h-6 w-6" />,
      activeWhen: ['/community', '/community-legacy'],
      onClick: () => navigate('/community')
    },
    { 
      path: '/profile', 
      label: 'Pet Profile', 
      icon: <User className="h-6 w-6" />,
      activeWhen: ['/profile', '/pet', '/history', '/analysis'],
      onClick: () => navigate('/profile')
    },
    { 
      path: '/trails', 
      label: 'Trails', 
      icon: <MapPin className="h-6 w-6" />,
      activeWhen: ['/trails', '/record'],
      onClick: () => navigate('/trails')
    },
  ];
  
  // Helper function to determine if a tab is active
  const isTabActive = (tab: typeof tabs[0]) => {
    return tab.activeWhen.some(path => location.pathname.startsWith(path));
  };
  
  console.log('TabBar rendering, current path:', location.pathname);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="h-full max-w-lg mx-auto px-4 flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={tab.onClick}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
              isTabActive(tab) 
                ? "text-emerald-600 dark:text-amber-500" 
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-amber-400"
            )}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;