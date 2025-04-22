import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PawPrint, MapPin, Map, User, BarChart, History, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import ThemeToggle from '../ui/ThemeToggle';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/trails', label: 'Find Trails', icon: <MapPin className="h-5 w-5" /> },
    { path: '/record', label: 'Record Hike', icon: <Map className="h-5 w-5" /> },
    { path: '/pets', label: 'Pet Profiles', icon: <PawPrint className="h-5 w-5" /> },
    { path: '/community', label: 'Community', icon: <Users className="h-5 w-5" /> },
    { path: '/history', label: 'History', icon: <History className="h-5 w-5" /> },
    { path: '/analysis', label: 'Analysis', icon: <BarChart className="h-5 w-5" /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <motion.div 
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <PawPrint className="h-8 w-8 text-emerald-600 dark:text-amber-400" />
              </motion.div>
              <span className="text-xl font-bold">PawTrails</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-amber-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <ThemeToggle className="ml-2" />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-base font-medium',
                  location.pathname === item.path
                    ? 'bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-amber-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={closeMenu}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;