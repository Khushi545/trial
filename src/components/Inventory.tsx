import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { InventoryItem } from '../types';
import AddItemModal from './AddItemModal';

interface InventoryProps {
  items: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh':
        return <CheckCircle className="w-4 h-4" />;
      case 'expiring':
        return <AlertCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'Fresh';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    const newName = prompt('Edit item name:', item.name);
    const newQuantity = prompt('Edit quantity:', item.quantity);
    if (newName && newQuantity) {
      onUpdateItem(item.id, { name: newName, quantity: newQuantity });
    }
  };

  const handleDeleteItem = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      onDeleteItem(item.id);
    }
  };

  return (
    <section id="inventory" className="py-16 bg-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl font-bold text-gray-800 font-heading">Kitchen Inventory</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Keep track of your ingredients with smart expiry alerts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 ${
                item.status === 'fresh' ? 'border-green-500' :
                item.status === 'expiring' ? 'border-yellow-500' : 'border-red-500'
              }`}
            >
              <div className="relative mb-4">
                <img
                  src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-4 border-gray-200"
                />
                <div className="absolute top-0 right-0 flex gap-1">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                    title="Edit item"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2 font-heading">
                  {item.name}
                </h4>
                <p className="text-gray-600 mb-2">{item.quantity}</p>
                
                {item.expiry && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>Expiry: {new Date(item.expiry).toLocaleDateString()}</span>
                  </div>
                )}

                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {getStatusLabel(item.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Add Product
          </button>
        </div>

        {showAddModal && (
          <AddItemModal
            onClose={() => setShowAddModal(false)}
            onAddItem={onAddItem}
          />
        )}
      </div>
    </section>
  );
};

export default Inventory;
