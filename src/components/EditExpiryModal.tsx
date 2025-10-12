import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { InventoryItem } from '../types';

interface EditExpiryModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSave: (newDate?: string) => void;
}

const EditExpiryModal: React.FC<EditExpiryModalProps> = ({ item, onClose, onSave }) => {
  const [date, setDate] = useState<string>(item.expiry || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-heading">Edit Expiry</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.name}</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Leave empty to clear expiry.</p>
        </div>

        <div className="flex gap-3 pt-5">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Cancel</button>
          <button
            onClick={() => onSave(date || undefined)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpiryModal;
