// src/components/Donation.tsx - Complete version with report button
import React, { useState } from 'react';
import { Heart, MapPin, TrendingUp, FileText } from 'lucide-react';
import { DonationStats, Shelter } from '../types';
import MapComponent from './MapComponent';
import SimpleReportModal from './SimpleReportModel';

const Donation: React.FC = () => {
  const [donationStats, setDonationStats] = useState<DonationStats>({
    currentMeals: 357,
    targetMeals: 500,
    percentage: 72
  });

  const [showReportModal, setShowReportModal] = useState(false);

  const [shelters] = useState<Shelter[]>([
    {
      id: '1',
      name: 'Hope Shelter',
      distance: '1.2 km away',
      location: { lat: 19.0820, lng: 72.8850 }
    },
    {
      id: '2',
      name: 'Food for All',
      distance: '2.5 km away',
      location: { lat: 19.0700, lng: 72.8700 }
    },
    {
      id: '3',
      name: 'Helping Hands',
      distance: '3.0 km away',
      location: { lat: 19.0850, lng: 72.8800 }
    }
  ]);

  const handleDonate = () => {
    const confirmed = confirm('Are you sure you want to donate surplus food? A nearby shelter will contact you soon.');
    
    if (!confirmed) return;
    
    setDonationStats(prev => {
      const increment = Math.floor(Math.random() * 10 + 5);
      const newCurrent = Math.min(prev.currentMeals + increment, prev.targetMeals);
      const newPercentage = (newCurrent / prev.targetMeals) * 100;
      
      return {
        ...prev,
        currentMeals: newCurrent,
        percentage: Math.min(newPercentage, 100)
      };
    });
    
    alert('Thank you for your donation request! A nearby shelter will contact you soon. Your contribution makes a real difference in the community.');
  };

  return (
    <section id="donate" className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl font-bold text-gray-800 font-heading">Donate Surplus Food</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make a difference in your community by sharing excess food
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h4 className="text-xl font-bold text-gray-800 font-heading">Monthly Impact</h4>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Meals Donated This Month</p>
              
              <div className="relative w-full h-4 bg-gray-200 rounded-full mb-4 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${donationStats.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <span className="text-green-600">{donationStats.currentMeals}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{donationStats.targetMeals}</span>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                {donationStats.percentage.toFixed(0)}% of monthly goal achieved
              </p>
            </div>
          </div>

          {/* Shelters Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h4 className="text-xl font-bold text-gray-800 font-heading">Nearby Shelters</h4>
            </div>
            
            <div className="space-y-3 mb-6">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => alert(`${shelter.name} - ${shelter.distance}\nClick on the map marker for more options!`)}
                >
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{shelter.name}</p>
                    <p className="text-xs text-gray-500">{shelter.distance}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Heart className="w-6 h-6" />
              Donate Now
            </button>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <h4 className="text-xl font-bold text-gray-800 mb-4 font-heading">Location Map</h4>
            
            <MapComponent 
              shelters={shelters} 
              height="240px" 
              zoom={13}
              center={[19.0760, 72.8777]}
              className="mb-4"
            />
            
            <div className="text-center">
              <p className="text-sm font-semibold text-green-600 mb-2">
                Thank you for making a difference!
              </p>
              <p className="text-xs text-gray-500">
                🔵 Your Location | 🔴 Shelters (5)
              </p>
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FileText className="w-6 h-6" />
            Generate Monthly Report
          </button>
          <p className="text-gray-600 mt-3 text-sm">
            View detailed analytics and download your impact report
          </p>
        </div>

        {/* Report Modal */}
        <SimpleReportModal 
          isOpen={showReportModal} 
          onClose={() => setShowReportModal(false)} 
        />
      </div>
    </section>
  );
};

export default Donation;
