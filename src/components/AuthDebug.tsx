import React from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthDebug: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-1">🐛 Auth Debug</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>User: {user ? user.email : 'null'}</div>
      <div>Timestamp: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};

export default AuthDebug;