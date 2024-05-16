from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Tuple
from pydantic import BaseModel

app = FastAPI()

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class PositionList(BaseModel):
    positions: List[Tuple[float, float]]

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set this to the appropriate origins or use ["http://localhost"] for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Add OPTIONS to the allowed methods
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_positions(position_list: PositionList):
    print(position_list)
    positions = position_list.positions
    # Do something with the positions data, such as saving it to a database
    return {"message": "Positions received successfully"}  # Restituisci un messaggio di conferma
