from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"

@app.get("/")
def read_root():
    return {"message": "Weather API Proxy is running"}

@app.get("/api/weather/{city}")
async def get_weather(city: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/weather", params={"q": city, "appid": API_KEY, "units": "metric"})
        if response.status_code != 200:
             raise HTTPException(status_code=response.status_code, detail=response.json().get("message", "Error fetching weather data"))
        return response.json()

@app.get("/api/forecast/{city}")
async def get_forecast(city: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not configured")

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/forecast", params={"q": city, "appid": API_KEY, "units": "metric"})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json().get("message", "Error fetching forecast data"))
        return response.json()
