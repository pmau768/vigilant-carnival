import React from 'react';
import { Users, User, Compass, Heart, History } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const TabBar: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    { 
      path: '/community', 
      label: 'Community', 
      icon: <Users className="h-6 w-6" />,
      activeWhen: ['/community']
    },
    { 
      path: '/pets', 
      label: 'Profile', 
      icon: <User className="h-6 w-6" />,
      activeWhen: ['/pets', '/pet']
    },
    { 
      path: '/adventures', 
      label: 'Adventures', 
      icon: <Compass className="h-6 w-6" />,
      activeWhen: ['/adventures', '/trails', '/record']
    },
  ];
  
  const isActive = (tab: typeof tabs[0]) => {
    return tab.activeWhen.some(path => location.pathname.startsWith(path));
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="h-full max-w-lg mx-auto px-4 flex justify-around items-center">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center justify-center w-full h-full",
                "transition-colors duration-200",
                isActive 
                  ? "text-emerald-600 dark:text-amber-500" 
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            {({ isActive: routeIsActive }) => (
              <>
                {tab.icon}
                <span className="text-xs mt-1">{tab.label}</span>
                {routeIsActive && (
                  <motion.div
                    className="absolute bottom-0 h-1 w-10 bg-emerald-600 dark:bg-amber-500 rounded-t-md"
                    layoutId="tab-indicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default TabBar;