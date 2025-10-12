// src/components/MapComponent.tsx - Clean version without lucide-react
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shelter } from '../types';

// Fix default icon issue
delete (L.Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Blue icon for user location
const UserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Red icon for shelters
const ShelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center
const ChangeView: React.FC<{ center: LatLngTuple; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface MapComponentProps {
  shelters: Shelter[];
  center?: LatLngTuple;
  zoom?: number;
  height?: string;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  shelters,
  center = [19.0760, 72.8777],
  zoom = 13,
  height = '300px',
  className = ''
}) => {
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(center);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newLocation: LatLngTuple = [lat, lng];
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          setLoading(false);
          setMapKey(prev => prev + 1);
        },
        () => {
          setLocationError('Using default location');
          setUserLocation(center);
          setMapCenter(center);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setUserLocation(center);
      setMapCenter(center);
      setLoading(false);
    }
  }, [center]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newLocation: LatLngTuple = [lat, lng];
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          setLocationError(null);
          setLoading(false);
          setMapKey(prev => prev + 1);
        },
        () => {
          setLocationError('Unable to get location');
          setLoading(false);
        }
      );
    }
  };

  const handleShelterContact = (shelter: Shelter) => {
    const message = `Hello! I would like to donate food through RasoiMate. Shelter: ${shelter.name}`;
    const phone = '1234567890';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    if (confirm(`Contact ${shelter.name} via WhatsApp?`)) {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div 
        className={`bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Location Button */}
      <div className="absolute top-2 right-2 z-[1000]">
        <button
          onClick={handleGetCurrentLocation}
          className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 transition-colors"
          title="Get current location"
        >
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="absolute top-2 left-2 z-[1000] bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-xs border border-yellow-200">
          {locationError}
        </div>
      )}

      {/* Map Container */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ height }}>
        <MapContainer 
          key={mapKey}
          center={mapCenter} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <ChangeView center={mapCenter} zoom={zoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={UserIcon}>
              <Popup>
                <div className="text-center p-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <strong className="text-blue-600">Your Location</strong>
                  </div>
                  <p className="text-sm text-gray-600">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Shelter Markers */}
          {shelters.map((shelter) => (
            <Marker
              key={shelter.id}
              position={[shelter.location.lat, shelter.location.lng]}
              icon={ShelterIcon}
            >
              <Popup>
                <div className="text-center p-2 min-w-[180px]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <strong className="text-red-600">{shelter.name}</strong>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{shelter.distance}</p>
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                      onClick={() => handleShelterContact(shelter)}
                    >
                      Contact
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.location.lat},${shelter.location.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
