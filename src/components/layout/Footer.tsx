import React from 'react';
import { PawPrint, Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <PawPrint className="h-8 w-8 mr-2 text-emerald-600 dark:text-amber-400" />
              <span className="text-xl font-bold">PawTrails</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Helping you find the perfect trails for you and your furry companion.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/trails" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Find Trails
                </Link>
              </li>
              <li>
                <Link to="/record" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Record Hike
                </Link>
              </li>
              <li>
                <Link to="/pets" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Pet Profiles
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Hiking History
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Dog-Friendly Trail Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Pet Health &amp; Exercise Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Weather Advisories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Pet Safety Outdoors
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-300">
                Email: support@pawtrails.com
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 transition-colors">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} PawTrails. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-amber-400 text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;