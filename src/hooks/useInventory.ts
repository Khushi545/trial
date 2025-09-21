import { useState, useEffect } from 'react';
import { InventoryItem } from '../types';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('inventory');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems.map((item: any, index: number) => ({
        id: item.id || String(index),
        name: item.name,
        quantity: item.quantity,
        expiry: item.expiry,
        status: item.status || 'fresh',
        image: item.image
      })));
    } else {
      // Initialize with sample data
      const sampleItems: InventoryItem[] = [
        {
          id: '1',
          name: 'Rice',
          quantity: '2 kg',
          expiry: '2025-07-25',
          status: 'fresh',
          image: 'https://images.pexels.com/photos/6210751/pexels-photo-6210751.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '2',
          name: 'Bread',
          quantity: '6 slices',
          expiry: '2025-01-15',
          status: 'expiring',
          image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '3',
          name: 'Milk',
          quantity: '1 L',
          expiry: '2025-01-10',
          status: 'expired',
          image: 'https://images.pexels.com/photos/416464/pexels-photo-416464.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '4',
          name: 'Tomato',
          quantity: '5 pcs',
          expiry: '2025-01-20',
          status: 'fresh',
          image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];
      setItems(sampleItems);
      localStorage.setItem('inventory', JSON.stringify(sampleItems));
    }
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  return { items, addItem, updateItem, deleteItem };
}