from typing import Optional
from pydantic import BaseModel


class Item(BaseModel):
    id: int


class Comment(BaseModel):
    text: str
    stars: float


class Coupon(BaseModel):
    code: Optional[str] = None


class Transaction(BaseModel):
    transaction_id: str
