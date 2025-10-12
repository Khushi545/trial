import React from 'react';
import { ChefHat as Bowl, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <Bowl className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-heading">RasoiMate</span>
            </div>
            <p className="text-gray-400">&copy; 2025 RasoiMate. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-gray-300 font-medium">Follow us:</p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mission */}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">
              Cook Smarter • Waste Less • Save More
            </p>
            <p className="text-gray-400 text-sm">
              Making every kitchen smarter and every meal count.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
