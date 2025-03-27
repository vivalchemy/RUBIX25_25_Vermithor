"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import Leaflet to prevent SSR issues
const LeafletMap = dynamic(() => import("../Leaflet/Leaflet"), { ssr: false });

interface GeocodeResult {
  formatted: string;
}

interface WeatherCondition {
  waypoint: string;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [vendors, setVendors] = useState<{ location_lat: number; location_lon: number; name: string }[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    totalDistance: string;
    totalDuration: string;
    weatherConditions: { waypoint: string; temperature: number; weather: string }[];
  } | null>(null);

  // Get user's current location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }

    // Fetch vendors
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/vendors`);
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

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
      const results: GeocodeResult[] = response.data.results;
      setSuggestions(results.map((result) => result.formatted));
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/directions`, {
        params: {
          origin_lat: originCoords[0],
          origin_lon: originCoords[1],
          destination_lat: destinationCoords[0],
          destination_lon: destinationCoords[1],
        },
      });

      const data = response.data;

      const fetchedWaypoints = data.weather_conditions.map((w: WeatherCondition) => {
        const [lat, lon] = w.waypoint
          .match(/\(([^)]+)\)/)?.[1]
          ?.split(", ")
          .map((v) => parseFloat(v)) ?? [0, 0];

        return [lat, lon] as [number, number];
      });

      setWaypoints(fetchedWaypoints);
      setRouteInfo({
        totalDistance: data.total_distance_km,
        totalDuration: data.total_duration_min,
        weatherConditions: data.weather_conditions,
      });
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

      {routeInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow">
          <p><strong>Total Distance:</strong> {routeInfo.totalDistance}</p>
          <p><strong>Total Duration:</strong> {routeInfo.totalDuration}</p>
          <h4 className="mt-2"><strong>Weather Conditions:</strong></h4>
          <ul className="list-disc pl-5">
            {routeInfo.weatherConditions.map((condition, index) => (
              <li key={index}>
                {condition.waypoint}: {condition.temperature}°C, {condition.weather}
              </li>
            ))}
          </ul>
        </div>
      )}

      <LeafletMap 
        userLocation={userLocation} 
        originCoords={originCoords} 
        destinationCoords={destinationCoords} 
        waypoints={waypoints}
        vendors={vendors}
      />
    </div>
  );
}