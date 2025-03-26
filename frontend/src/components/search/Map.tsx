import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Product, Vendor } from "@/lib/types/Reset";

// Dynamically import React Leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });


// Fix Leaflet default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function Map({ products }: { products: Product[] }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorData: Vendor[] = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/vendors/item/${product.itemId}`);

            return {
              vendorId: response.data.id,
              name: response.data.name,
              email: response.data.email,
              password: response.data.password,
              address: response.data.address,
              shopName: response.data.shopName,
              location_lat: response.data.location_lat,
              location_lon: response.data.location_lon,
              rating: response.data.rating,
            };
          })
        );

        setVendors(vendorData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    if (products.length > 0) {
      fetchVendors();
    }
  }, [products]);


  // Fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Nearby Vendors</h2>
      <div className="h-64 rounded-lg">
        {userLocation ? (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* User Marker */}
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
            {/* Vendor Markers */}
            {vendors.map((vendor, index) => (
              <Marker key={index} position={[vendor.location_lat, vendor.location_lon]}>
                <Popup>{vendor.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center bg-gray-200 h-full">
            <p>Loading map and user location...</p>
          </div>
        )}
      </div>
    </div>
  );
}
