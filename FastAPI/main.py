from fastapi import FastAPI, Query
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv()

# OpenWeatherMap API Key
OPENWEATHERMAP_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY")

# OSRM base URL
OSRM_BASE_URL = "http://router.project-osrm.org"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/directions")
def get_directions(
    origin_lat: float = Query(..., description="Latitude of the starting location"),
    origin_lon: float = Query(..., description="Longitude of the starting location"),
    destination_lat: float = Query(..., description="Latitude of the destination"),
    destination_lon: float = Query(..., description="Longitude of the destination"),
):
    try:
        print(f"Origin: ({origin_lat}, {origin_lon}), Destination: ({destination_lat}, {destination_lon})")
    except Exception as e:
        return {"error": f"Invalid query parameters: {e}"}
    
    osrm_route_url = (
        f"{OSRM_BASE_URL}/route/v1/driving/{origin_lon},{origin_lat};{destination_lon},{destination_lat}"
        f"?overview=full&geometries=geojson"
    )
    osrm_response = requests.get(osrm_route_url)
    osrm_data = osrm_response.json()
    print(osrm_data)

    if osrm_response.status_code != 200 or "routes" not in osrm_data or not osrm_data["routes"]:
        return {"error": "Unable to fetch directions from OSRM."}

    # Extract route information
    route = osrm_data["routes"][0]
    distance = route["distance"] / 1000  # Convert to kilometers
    duration = route["duration"] / 60  # Convert to minutes
    waypoints = route["geometry"]["coordinates"]

    # Step 2: Fetch weather data for waypoints from OpenWeatherMap
    weather_data = []
    for i, waypoint in enumerate(waypoints[::len(waypoints)//10 + 1]):  # Sample waypoints (10 points max)
        lon, lat = waypoint
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
        )
        weather_response = requests.get(weather_url)
        if weather_response.status_code == 200:
            weather_info = weather_response.json()
            weather_data.append({
                "waypoint": f"Point {i + 1} ({lat}, {lon})",
                "temperature": weather_info["main"]["temp"],
                "weather": weather_info["weather"][0]["description"]
            })
        else:
            weather_data.append({"waypoint": f"Point {i + 1} ({lat}, {lon})", "error": "Unable to fetch weather data."})

    # Step 3: Combine directions and weather data
    return {
        "total_distance_km": f"{distance:.2f} km",
        "total_duration_min": f"{duration:.2f} minutes",
        "weather_conditions": weather_data,
    }
