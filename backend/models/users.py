from fastapi import Query
from pydantic import BaseModel, validator, model_validator, EmailStr
from datetime import datetime
from typing import Annotated

from helpers import is_password_valid, create_password_hash


def constr_length(min_length: int, max_length: int):
    def length_validator(string: str):
        if not min_length <= len(string) <= max_length:
            raise ValueError(
                f"String must be between {min_length} and {max_length} characters long"
            )
        return string

    return length_validator


class UserRegistration(BaseModel):
    # TODO: Implement some validators
    username: str
    password: str
    email: str


class UserLogin(BaseModel):
    # TODO: Implement some validators
    username: str
    password: str


class PaymentCard(BaseModel):
    # TODO: constr_length doesn't work rn
    card_number: Annotated[str, constr_length(16, 16)]
    card_holder: Annotated[str, constr_length(3, 100)]
    expiration_date: str
    cvv: Annotated[str, constr_length(3, 3)]

    @validator("expiration_date")
    def validate_expiration_date(cls, v):
        try:
            datetime.strptime(v, "%m/%y")
        except ValueError as e:
            raise ValueError("Incorrect date format, should be MM/YY") from e
        return v

    @validator("card_holder")
    def to_upper_case(cls, v):
        return v.upper()


class UserUpdate(BaseModel):
    # TODO: Implement some validators
    username: Annotated[str, Query(min_length=3, max_length=30)] = None
    email: EmailStr = None
    password: str = None

    @model_validator(mode="before")
    def any_of(cls, values):
        if not any(values.values()):
            raise ValueError("At least one field must be filled")
        return values

    @validator("password")
    def password_validator(cls, value):
        if value is not None and not is_password_valid(value):
            raise ValueError("Password is not valid")
        return create_password_hash(value)
