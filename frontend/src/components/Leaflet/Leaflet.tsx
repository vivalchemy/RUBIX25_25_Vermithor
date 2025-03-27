"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

// Fix for default marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
  userLocation: [number, number] | null;
  originCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  waypoints: [number, number][];
  vendors: { location_lat: number; location_lon: number; name: string }[];
}

export default function LeafletMap({
  userLocation, 
  originCoords, 
  destinationCoords, 
  waypoints, 
  vendors 
}: LeafletMapProps) {
  // Create a custom vendor icon
  const vendorIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    iconColor: "#FF5733",
  });

  return (
    <div className="h-[400px] w-full mx-auto relative mb-8">
      <MapContainer
        center={userLocation || [19.0760, 72.8777]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && <Marker position={userLocation} />}
        {originCoords && <Marker position={originCoords} />}
        {destinationCoords && <Marker position={destinationCoords} />}
        {waypoints.length > 1 && (
          <>
            <Polyline positions={waypoints} color="blue" />
            {waypoints.map((waypoint, index) => (
              <Marker key={index} position={waypoint} />
            ))}
          </>
        )}
        {vendors.map((vendor, index) => (
          <Marker
            key={index}
            position={[vendor.location_lat, vendor.location_lon]}
            icon={vendorIcon}
          >
            <div>{vendor.name}</div>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}