import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  rightContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  backTo, 
  rightContent 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="mr-3 p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {rightContent}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;