from typing import List
from pydantic import BaseModel
from enum import Enum


class TagEnum(Enum):
    fps = "fps"
    rpg = "rpg"
    mmorpg = "mmorpg"
    racing = "racing"
    horror = "horror"
    action = "action"
    adventure = "adventure"
    simulation = "simulation"
    strategy = "strategy"
    sports = "sports"
    puzzle = "puzzle"
    idle = "idle"
    clicker = "clicker"
    arcade = "arcade"
    platformer = "platformer"
    roguelike = "roguelike"
    open_world = "open_world"
    sandbox = "sandbox"
    survival = "survival"
    battle_royale = "battle_royale"
    shooter = "shooter"


class GameTagFilter(BaseModel):
    description_contains: str = None
    price_gte: float = None
    price_lte: float = None
    tags: List[TagEnum] = []
    languages: list = None
    authors: list = None
