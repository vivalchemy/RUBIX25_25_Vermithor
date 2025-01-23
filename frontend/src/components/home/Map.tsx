"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Dynamically import React Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006]; // NYC
const DEFAULT_ZOOM = 10;

export default function Map() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q: query,
          key: process.env.NEXT_PUBLIC_GEOCODING_API,
          limit: 5,
        },
      });
      const results = response.data.results;
      setSuggestions(results.map((result: any) => result.formatted));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectLocation = async (location: string, setCoords: (coords: [number, number]) => void) => {
    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q: location,
          key: process.env.NEXT_PUBLIC_GEOCODING_API,
        },
      });
      const result = response.data.results[0];
      const coords: [number, number] = [result.geometry.lat, result.geometry.lng];
      setCoords(coords);
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
    setSuggestions([]);
  };

  const handleGetDirections = async () => {
    if (!originCoords || !destinationCoords) {
      alert("Please select both origin and destination.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/directions", {
        params: {
          origin_lat: originCoords[0],
          origin_lon: originCoords[1],
          destination_lat: destinationCoords[0],
          destination_lon: destinationCoords[1],
        },
      });

      const data = response.data;

      const fetchedWaypoints = data.weather_conditions.map((w: any) => {
        const [lat, lon] = w.waypoint
          .match(/\(([^)]+)\)/)[1]
          .split(", ")
          .map((v) => parseFloat(v));
        return [lat, lon] as [number, number];
      });

      setWaypoints(fetchedWaypoints);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-4 mb-4">
        <div>
          <input
            className="w-full p-2 border rounded"
            type="text"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            placeholder="Enter origin location"
          />
          <ul className="absolute bg-white border rounded mt-1 max-h-40 overflow-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setOrigin(suggestion);
                  handleSelectLocation(suggestion, setOriginCoords);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <input
            className="w-full p-2 border rounded"
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            placeholder="Enter destination location"
          />
          <ul className="absolute bg-white border rounded mt-1 max-h-40 overflow-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setDestination(suggestion);
                  handleSelectLocation(suggestion, setDestinationCoords);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleGetDirections}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Directions"}
        </button>
      </div>

      <div className="h-[400px] w-[600px] mx-auto relative mb-8">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {originCoords && <Marker position={originCoords} />}
          {destinationCoords && <Marker position={destinationCoords} />}
          {waypoints.length > 1 && <Polyline positions={waypoints} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
}
