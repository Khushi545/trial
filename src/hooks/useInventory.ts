import { useState, useEffect } from 'react';
import { InventoryItem } from '../types';

function toISODate(d: Date): string {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

function computeStatus(expiry?: string): InventoryItem['status'] {
  if (!expiry) return 'fresh';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiry);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'expiring';
  return 'fresh';
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  // Recompute all item statuses and persist
  const recomputeAll = () => {
    setItems((prev) => {
      const updated = prev.map((it) => ({ ...it, status: computeStatus(it.expiry) }));
      localStorage.setItem('inventory', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const savedItems = localStorage.getItem('inventory');
    if (savedItems) {
      const parsed = JSON.parse(savedItems) as unknown;
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((raw, index: number) => {
          const item = raw as Partial<InventoryItem>;
          const expiry = item.expiry;
          const status = computeStatus(expiry);
          return {
            id: item.id || String(index),
            name: item.name || '',
            quantity: item.quantity || '',
            expiry,
            status,
            image: item.image,
          } as InventoryItem;
        });
        setItems(normalized);
        localStorage.setItem('inventory', JSON.stringify(normalized));
      } else {
        setItems([]);
      }
    } else {
      // Initialize with sample data using dynamic expiries
      const today = new Date();
      const sampleItems: InventoryItem[] = [
        {
          id: '1',
          name: 'Rice',
          quantity: '2 kg',
          expiry: toISODate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 90)), // ~3 months
          status: 'fresh',
          image: 'https://images.pexels.com/photos/6210751/pexels-photo-6210751.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '2',
          name: 'Bread',
          quantity: '6 slices',
          expiry: toISODate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 3)), // ~3 days
          status: 'expiring',
          image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '3',
          name: 'Milk',
          quantity: '1 L',
          expiry: toISODate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2)), // expired 2 days ago
          status: 'expired',
          image: 'https://images.pexels.com/photos/416464/pexels-photo-416464.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '4',
          name: 'Tomato',
          quantity: '5 pcs',
          expiry: toISODate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 14)), // ~2 weeks
          status: 'fresh',
          image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ].map((it) => ({ ...it, status: computeStatus(it.expiry) }));
      setItems(sampleItems);
      localStorage.setItem('inventory', JSON.stringify(sampleItems));
    }
  }, []);

  // Schedule auto-refresh at local midnight
  useEffect(() => {
    const schedule = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0); // next midnight
      const ms = next.getTime() - now.getTime();
      const timer = setTimeout(() => {
        recomputeAll();
        schedule(); // schedule again for the following midnight
      }, ms);
      return timer;
    };

    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      status: computeStatus(item.expiry),
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const updatedItems = items.map(item => {
      if (item.id !== id) return item;
      const next: InventoryItem = { ...item, ...updates } as InventoryItem;
      next.status = computeStatus(next.expiry);
      return next;
    });
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
