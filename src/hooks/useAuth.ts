import { useState, useEffect } from 'react';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser({ email: currentUser });
    }
  }, []);

  const login = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('currentUser', email);
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    // Initialize users array if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }
    
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const authenticate = async (email: string, password: string): Promise<boolean> => {
    // Initialize users array if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Add a default demo user if no users exist
    if (users.length === 0) {
      const defaultUsers = [
        { email: 'test@example.com', password: 'password123' },
        { email: 'demo@rasoimate.com', password: 'demo123' }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      users.push(...defaultUsers);
    }
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      login(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return { user, login, register, authenticate, logout };
}