import requests
import json
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime
import os

# Pydantic models are here just in case I need to modify something in the future.


class Slot(BaseModel):
    id: int
    name: str
    emoji: str
    hash: str
    listAlone: bool
    hideable: bool
    hideForSlot: Optional[int]
    background: Optional[str]


class Environment(BaseModel):
    id: int
    name: str
    hash: str
    path: str
    version: int
    imageUrl: HttpUrl


class GameMode(BaseModel):
    id: int
    name: str
    hash: str
    version: int
    color: str
    bgColor: str
    link: HttpUrl
    imageUrl: HttpUrl


class Stat(BaseModel):
    brawler: int
    winRate: float
    useRate: float


class Map(BaseModel):
    id: int
    new: bool
    disabled: bool
    name: str
    hash: str
    version: int
    link: HttpUrl
    imageUrl: HttpUrl
    credit: str
    environment: Environment
    gameMode: GameMode
    lastActive: int
    dataUpdated: int
    stats: List[Stat]
    teamStats: List[None]  # TBD


class Event(BaseModel):
    slot: Slot
    predicted: bool
    startTime: datetime
    endTime: datetime
    reward: int
    map: Map
    modifier: Optional[str]


def update_maps(s: requests.Session) -> None:
    today = datetime.today()
    dir = f"{today.year}/{today.month}"

    events_data = s.get("https://api.brawlify.com/v1/events")
    events = [Event.model_validate(e) for e in events_data]

    if not os.path.isdir(dir):
        os.makedirs(dir)

    with open(f"{dir}/{today.day}", "w") as f:
        json.dump([e.model_dump() for e in events], f, indent=4)


if __name__ == "__main__":
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": "BrawlStars Events (https://github.com/Victorsitou/brawlstars-events)"
        }
    )
    update_maps(s)
