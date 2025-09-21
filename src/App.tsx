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
  const { user, login, register, logout } = useAuth();
  const { items, addItem, updateItem, deleteItem } = useInventory();

  useEffect(() => {
    // Always show auth modal if no user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, []);

  const handleAuthSuccess = (userData: { email: string }) => {
    login(userData.email);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowAuthModal(true);
  };

  // Always show auth modal when no user is logged in
  if (!user || showAuthModal) {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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