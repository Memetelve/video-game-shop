from pydantic import BaseModel


class UserRegistration(BaseModel):
    username: str
    password: str
    email: str


class UserLogin(BaseModel):
    username: str
    password: str


class PaymentCard(BaseModel):
    card_number: str
    card_holder: str
    expiration_date: str
    cvv: str
