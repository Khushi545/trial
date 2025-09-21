import React from 'react';
import { BookDown as Bowl, LogOut, User } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-full flex items-center justify-center">
              <Bowl className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600 font-heading">
              RasoiMate
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('inventory')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Inventory
            </button>
            <button
              onClick={() => scrollToSection('recipes')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Recipes
            </button>
            <button
              onClick={() => scrollToSection('donate')}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Donate
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium truncate max-w-32">
                  {user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;