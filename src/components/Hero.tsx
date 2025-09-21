import React from 'react';
import { ArrowRight, Play, Leaf, Heart, Utensils } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-green-500 via-green-600 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Cook Smarter.
              <br />
              Waste Less.
              <br />
              <span className="text-orange-300">Share More.</span>
            </h1>
            <p className="text-xl mb-8 text-green-100 leading-relaxed">
              Track your kitchen, discover recipes, and donate surplus food—all in one intelligent platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('features')}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm border border-white/30 transition-all duration-300 transform hover:scale-105">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-80 h-80 mx-auto">
              <img
                src="https://cdnl.iconscout.com/lottie/free/thumb/free-cooking-6834623-5605459.gif"
                alt="Smart Kitchen"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-7 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 animate-bounce">
                <Leaf className="w-8 h-8 text-green-200" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 animate-bounce delay-1000">
                <Heart className="w-8 h-8 text-red-200" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 animate-bounce delay-500">
                <Utensils className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;