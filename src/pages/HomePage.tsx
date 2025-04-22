import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Route, PawPrint, Activity } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img
            src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Dog hiking in nature"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find the Perfect Trails for You and Your Furry Friend
            </h1>
            <p className="text-xl mb-8 text-emerald-50">
              Personalized hiking recommendations based on your pet's breed, energy level, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/trails')}
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Find Trails
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/pets')}
                className="border-white text-white hover:bg-emerald-700"
              >
                Create Pet Profile
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why PawTrails?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help you find the perfect trails and track your adventures with your furry hiking buddy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Trails</h3>
              <p className="text-gray-600">
                Get trail recommendations tailored to your pet's breed, age, and activity level.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Route className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Hikes</h3>
              <p className="text-gray-600">
                Track your hikes with GPS and keep a history of all your adventures together.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <PawPrint className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pet Profiles</h3>
              <p className="text-gray-600">
                Create detailed profiles for all your pets with their preferences and needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Get AI-powered insights about your hike and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find the Perfect Trail?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create a profile for your pet and get personalized trail recommendations today.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/pets')}
            className="bg-white text-sky-600 hover:bg-sky-50"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;