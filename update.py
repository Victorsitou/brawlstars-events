import requests
import json
from pydantic import BaseModel
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
    imageUrl: str


class GameMode(BaseModel):
    id: Optional[int] = None
    name: str
    hash: str
    version: int
    color: str
    bgColor: str
    link: str
    imageUrl: str


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
    link: str
    imageUrl: str
    credit: Optional[str]
    environment: Environment
    gameMode: GameMode
    lastActive: int
    dataUpdated: int
    stats: List[Stat]
    teamStats: List[None]  # TBD


class Event(BaseModel):
    slot: Slot
    predicted: bool
    startTime: str
    endTime: str
    reward: int
    map: Map
    modifier: Optional[str]


class Events(BaseModel):
    active: List[Event]
    upcoming: List[Event]


def update_maps(s: requests.Session) -> None:
    today = datetime.today()
    dir = f"{today.year}/{today.month}"

    events_data = s.get("https://api.brawlify.com/v1/events")

    if not os.path.isdir(dir):
        os.makedirs(dir)

    with open(f"{dir}/{today.day}.json", "w", encoding="utf-8") as f:
        json.dump(
            Events.model_validate(events_data.json()).model_dump(),
            f,
            indent=4,
            ensure_ascii=False,
        )


if __name__ == "__main__":
    s = requests.Session()
    s.headers.update(
        {
            "User-Agent": "BrawlStars Events (https://github.com/Victorsitou/brawlstars-events)"
        }
    )
    update_maps(s)
