export interface User {
  email: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  expiry?: string;
  status: 'fresh' | 'expiring' | 'expired';
  image?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  image: string;
  description: string;
}

export interface Shelter {
  id: string;
  name: string;
  distance: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface DonationStats {
  currentMeals: number;
  targetMeals: number;
  percentage: number;
}