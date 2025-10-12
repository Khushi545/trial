import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { InventoryItem } from '../types';

interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiry: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      alert('Please fill in at least name and quantity');
      return;
    }

    // Determine status based on expiry date
    let status: 'fresh' | 'expiring' | 'expired' = 'fresh';
    if (formData.expiry) {
      const expiryDate = new Date(formData.expiry);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 7) {
        status = 'expiring';
      } else {
        status = 'fresh';
      }
    }

    onAddItem({
      name: formData.name,
      quantity: formData.quantity,
      expiry: formData.expiry || undefined,
      status,
      image: formData.image || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 font-heading">Add New Item</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g., Rice, Tomatoes, Milk"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g., 2 kg, 6 pieces, 1 L"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;