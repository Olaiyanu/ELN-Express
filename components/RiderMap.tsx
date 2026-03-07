import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Order } from '../types';
import { Package, Check, X, MapPin, Navigation } from 'lucide-react';

// Fix Leaflet marker icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for rider
const riderIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for requests
const requestIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for pickup
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom icon for dropoff
const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface RiderMapProps {
  riderLocation: { lat: number; lng: number } | null;
  nearbyRequests: Order[];
  activeOrder?: Order | null;
  onAccept: (orderId: string) => void;
  onDecline: (orderId: string) => void;
}

const RecenterMap = ({ location }: { location: { lat: number; lng: number } | null }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 13);
    }
  }, [location, map]);
  return null;
};

const RiderMap: React.FC<RiderMapProps> = ({ riderLocation, nearbyRequests, activeOrder, onAccept, onDecline }) => {
  const defaultCenter: [number, number] = [6.5244, 3.3792]; // Lagos

  // Calculate coordinates for active order if present
  const activePickupCoord: [number, number] | null = activeOrder ? 
    [activeOrder.lat || 6.5244, activeOrder.lng || 3.3792] : null;
  
  // Mock dropoff location slightly offset from pickup
  const activeDropoffCoord: [number, number] | null = activeOrder ? 
    [(activeOrder.lat || 6.5244) + 0.02, (activeOrder.lng || 3.3792) + 0.02] : null;

  return (
    <div className="h-full w-full rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl relative z-0">
      <MapContainer 
        center={riderLocation ? [riderLocation.lat, riderLocation.lng] : defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {riderLocation && (
          <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
            <Popup>
              <div className="text-center font-black text-eln uppercase text-[10px] tracking-widest">
                Your Current Position
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Order Route */}
        {activeOrder && activePickupCoord && activeDropoffCoord && (
          <>
            <Marker position={activePickupCoord} icon={pickupIcon}>
              <Popup>
                <div className="p-2 space-y-1">
                  <p className="text-[8px] font-black text-green-600 uppercase tracking-widest">Pickup Point</p>
                  <p className="font-bold text-gray-800 text-xs">{activeOrder.merchantName}</p>
                  <p className="text-[9px] text-gray-500">{activeOrder.pickupAddress}</p>
                </div>
              </Popup>
            </Marker>
            <Marker position={activeDropoffCoord} icon={dropoffIcon}>
              <Popup>
                <div className="p-2 space-y-1">
                  <p className="text-[8px] font-black text-red-600 uppercase tracking-widest">Dropoff Point</p>
                  <p className="font-bold text-gray-800 text-xs">{activeOrder.customerName}</p>
                  <p className="text-[9px] text-gray-500">{activeOrder.deliveryAddress}</p>
                </div>
              </Popup>
            </Marker>
            <Polyline 
              positions={[activePickupCoord, activeDropoffCoord]} 
              color="#FF7A00" 
              weight={4} 
              dashArray="10, 10"
              opacity={0.6}
            />
          </>
        )}

        {nearbyRequests.filter(req => req.id !== activeOrder?.id).map((req) => {
          const lat = req.lat || 6.5244 + (Math.random() - 0.5) * 0.05;
          const lng = req.lng || 3.3792 + (Math.random() - 0.5) * 0.05;

          return (
            <Marker key={req.id} position={[lat, lng]} icon={requestIcon}>
              <Popup>
                <div className="p-2 space-y-3 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-orange-500" />
                      <span className="font-black text-xs uppercase">#{req.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Nearby Request</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">From</p>
                      <p className="font-bold text-gray-800 text-xs">{req.merchantName}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">To</p>
                      <p className="font-bold text-gray-800 text-xs">{req.customerName}</p>
                      <p className="text-[9px] text-gray-500 leading-tight">{req.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => onAccept(req.id)}
                      className="flex-1 bg-eln text-white py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center space-x-1 shadow-lg shadow-eln/20 hover:scale-105 transition-all"
                    >
                      <Check className="h-3 w-3" />
                      <span>Accept</span>
                    </button>
                    <button 
                      onClick={() => onDecline(req.id)}
                      className="flex-1 bg-gray-50 text-gray-400 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center space-x-1 border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <X className="h-3 w-3" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <RecenterMap location={riderLocation} />
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl z-[1000] space-y-2">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">You</span>
        </div>
        {activeOrder && (
          <>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Pickup</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Dropoff</span>
            </div>
          </>
        )}
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Pending Requests</span>
        </div>
      </div>
    </div>
  );
};

export default RiderMap;
