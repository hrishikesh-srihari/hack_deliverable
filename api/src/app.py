from datetime import datetime, timedelta
from typing import TypedDict, List, Optional
from fastapi import FastAPI, Form, Query, status
from fastapi.responses import RedirectResponse, JSONResponse
from services.database import JSONDatabase

app = FastAPI()

class Quote(TypedDict):
    name: str
    message: str
    time: str

database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")

@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """Process a user submitting a new quote."""
    now = datetime.now().replace(microsecond=0)
    quote = Quote(name=name, message=message, time=now.isoformat())
    database["quotes"].append(quote)
    return JSONResponse(quote, status_code=status.HTTP_201_CREATED)


@app.get("/quotes")
def get_quotes(max_age: Optional[int] = None) -> JSONResponse:
    """
    Retrieve quotes from the database.
    
    Args:
        max_age (int, optional): Maximum age of quotes in days. If not provided, all quotes will be returned.
    
    Returns:
        JSONResponse: A JSON response containing the list of quotes.
    """
    quotes = database["quotes"]
    if max_age is not None:
        cutoff = datetime.now() - timedelta(days=max_age)
        quotes = [quote for quote in quotes if datetime.fromisoformat(quote["time"]) >= cutoff]
    return JSONResponse(quotes)