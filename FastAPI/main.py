from fastapi import FastAPI, Query, HTTPException
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from typing import List
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

app = FastAPI()
load_dotenv()


#### Directions and Weather ####

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

#### Predict Food Sales ####

# Load dataset (replace with actual path)
data = pd.read_csv("synthetic_sales_data12.csv")

# Model Initialization
model_instance = None

class FoodSalesForecastModel:
    def __init__(self, data):
        self.data = data
        self.prepare_data()

    def prepare_data(self):
    # Identify all potential feature columns
        all_columns = self.data.columns.tolist()
        
        # Include all numeric columns as potential features
        features = [col for col in all_columns if self.data[col].dtype in ['int64', 'float64']]
        target = 'Sales (Qty)'
        
        # Ensure target is not duplicated in features
        if target in features:
            features.remove(target)
        
        X = self.data[features + [target]].values
        y = self.data[target].values

        self.scaler_X = MinMaxScaler()
        self.scaler_y = MinMaxScaler()

        X_scaled = self.scaler_X.fit_transform(X)
        y_scaled = self.scaler_y.fit_transform(y.reshape(-1, 1))

        def create_sequences(X, y, time_steps=7):
            X_seq, y_seq = [], []
            for i in range(len(X) - time_steps):
                X_seq.append(X[i:i + time_steps])
                y_seq.append(y[i + time_steps])
            return np.array(X_seq), np.array(y_seq)

        self.X_seq, self.y_seq = create_sequences(X_scaled, y_scaled)

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X_seq, self.y_seq, test_size=0.2, random_state=42
        )

    def build_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(10, activation='relu', input_shape=(self.X_train.shape[1], self.X_train.shape[2]), return_sequences=True),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.LSTM(10, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(25, activation='relu'),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model

    def train_model(self, epochs=1, batch_size=32):
        self.model = self.build_model()

        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', patience=10, restore_best_weights=True
        )

        self.model.fit(
            self.X_train, self.y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            callbacks=[early_stopping],
            verbose=1
        )

    def predict_next_7_days(self):
    # Select the last 7 days of data
        last_7_days_data = self.X_seq[-1]
        
        # Reshape for prediction
        last_7_days_seq = last_7_days_data.reshape(1, 7, last_7_days_data.shape[1])

        # Predict
        predicted_scaled = self.model.predict(last_7_days_seq)
        predicted_sales = self.scaler_y.inverse_transform(predicted_scaled)

        # Convert to Python native float
        return float(predicted_sales[0][0])
    
    def get_top_items(self, top_n=5):
        item_sales = self.data.groupby('Item')['Sales (Qty)'].mean().reset_index()
        item_sales = item_sales.sort_values('Sales (Qty)', ascending=False)
        return item_sales.head(top_n).to_dict(orient='records')



# Initialize and train the model
model_instance = FoodSalesForecastModel(data)
model_instance.train_model()


class PredictRequest(BaseModel):
    last_7_days_data: List[List[float]]  # Nested list representing 7 days of data


@app.post("/predict-food")
async def predict_food_sales(request: PredictRequest):
    try:
        predicted_sales = float(model_instance.predict_next_7_days())
        last_7_days_items = model_instance.get_top_items()

        return {
            "predicted_sales": predicted_sales,
             "last_7_days_items": last_7_days_items
                
            
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#### 


