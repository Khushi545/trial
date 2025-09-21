import React from 'react';
import { ClipboardList, Utensils, Heart, Lightbulb } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: ClipboardList,
      title: 'Inventory Tracking',
      description: 'Smart expiry reminders and easy stock management for your kitchen.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Utensils,
      title: 'Smart Recipes',
      description: 'Turn leftovers into delicious meals with creative, AI-powered suggestions.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Heart,
      title: 'Food Donation',
      description: 'Donate surplus food to local shelters and make a real impact in your community.',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <>
      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl font-bold text-gray-800 font-heading">What We Do</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            RasoiMate is your smart kitchen companion, helping you track inventory, discover recipes, 
            and donate surplus food to those in need.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center font-heading">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;