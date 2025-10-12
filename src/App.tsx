import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Inventory from './components/Inventory';
import Recipes from './components/Recipes';
import Donation from './components/Donation';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import MonthlyReportButton from './components/MonthlyReportButton';
import MonthlyReportModal from './components/MonthlyReportModal';
import AuthDebug from './components/AuthDebug';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const { user, logout, loading } = useAuth();
  const { items, addItem, updateItem, deleteItem } = useInventory();

  useEffect(() => {
    console.log('App useEffect - loading:', loading, 'user:', user?.email || 'null', 'showAuthModal:', showAuthModal);
    // Show auth modal if no user is logged in and not loading
    if (!loading && !user) {
      console.log('Setting showAuthModal to true - no user and not loading');
      setShowAuthModal(true);
    } else if (user) {
      console.log('Setting showAuthModal to false - user exists:', user.email);
      setShowAuthModal(false);
    }
  }, [user, loading, showAuthModal]);

  const handleAuthSuccess = (_userData: { email: string }) => {
    // Firebase auth automatically updates user state, so just close modal
    // We'll let the useEffect handle closing the modal when user state updates
    console.log('Authentication successful, waiting for user state update');
  };

  const handleLogout = () => {
    logout();
    setShowAuthModal(true);
  };

  // Show loading spinner while Firebase auth is initializing
  if (loading) {
    console.log('Rendering loading screen');
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
    console.log('Rendering AuthModal - user:', user?.email || 'null', 'showAuthModal:', showAuthModal);
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  console.log('Rendering main app for user:', user?.email);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AuthDebug />
      <Header user={user} onLogout={handleLogout} />
      <Hero />
      <Features />
      
      {/* Monthly Report Button */}
      <div className="container mx-auto px-4">
        <MonthlyReportButton onClick={() => setShowMonthlyReport(true)} />
      </div>
      
      <Inventory 
        items={items}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
      />
      <Recipes availableIngredients={items} />
      <Donation />
      <Footer />
      
      {/* Monthly Report Modal */}
      <MonthlyReportModal
        isOpen={showMonthlyReport}
        onClose={() => setShowMonthlyReport(false)}
        inventoryItems={items}
      />
    </div>
  );
}

export default App;