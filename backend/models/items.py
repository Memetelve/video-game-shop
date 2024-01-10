from pydantic import BaseModel


class Item(BaseModel):
    id: int


class Comment(BaseModel):
    text: str
    stars: float


class Coupon(BaseModel):
    code: str
