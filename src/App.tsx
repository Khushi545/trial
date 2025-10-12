import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Inventory from './components/Inventory';
import Recipes from './components/Recipes';
import Donation from './components/Donation';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, loading } = useAuth();
  const { items, addItem, updateItem, deleteItem } = useInventory();

  useEffect(() => {
    // Show auth modal if no user is logged in and not loading
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  const handleAuthSuccess = (_userData: { email: string }) => {
    // Firebase auth automatically updates user state, so just close modal
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowAuthModal(true);
  };

  // Show loading spinner while Firebase auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Always show auth modal when no user is logged in
  if (!user || showAuthModal) {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header user={user} onLogout={handleLogout} />
      <Hero />
      <Features />
      <Inventory 
        items={items}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
      />
      <Recipes availableIngredients={items} />
      <Donation />
      <Footer />
    </div>
  );
}

export default App;