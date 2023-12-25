import os
import re
import binascii

from datetime import datetime, timedelta, timezone
from hashlib import sha256
from neo4j import AsyncGraphDatabase

time_symbols = {
    "s": 1,
    "m": 60,
    "h": 3600,
    "d": 86400,
    "w": 604800,
    "M": 2629746,
    "y": 31556952,
}


def get_driver():
    # TODO: Add this to config file
    return AsyncGraphDatabase.driver(
        "bolt://localhost:7687", auth=("neo4j", "mmmmmmmm")
    )


def time_symbol_to_seconds(time):
    if time[-1] not in time_symbols:
        raise ValueError("Invalid time symbol")
    return int(time[:-1]) * time_symbols[time[-1]]


def create_filter_string(params, args):
    filtering_string = "{"
    not_first_param = False
    for param in params:
        if param in args:
            if not_first_param:
                filtering_string += ", "
            if param == "employee_id":
                filtering_string += f"{param}: {args[param]}"
            else:
                filtering_string += f"{param}: '{args[param]}'"
            not_first_param = True

    filtering_string += "}"
    return filtering_string


def create_password_hash(password):
    return sha256(password.encode()).hexdigest()


def is_username_valid(username) -> bool:
    minimum_length = 3
    maximum_length = 24

    return (
        len(username) >= minimum_length
        and len(username) <= maximum_length
        and re.match(r"(^[a-zA-Z0-9_.-]+$)", username)
    )


def is_email_valid(email) -> bool:
    return re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email)


def is_password_valid(password) -> bool:
    # TODO: Add this to config file
    minimum_length = 8
    maximum_length = 64
    special_characters_required = True
    big_letters_required = True
    numbers_required = True
    return (
        len(password) >= minimum_length
        and len(password) <= maximum_length
        and any(char.isupper() for char in password) in [big_letters_required, True]
        and any(char.isdigit() for char in password) in [numbers_required, True]
        and any(not char.isalnum() for char in password)
        in [special_characters_required, True]
    )


def create_access_token_with_time(expires_delta: str = None):
    if expires_delta:
        expires_delta = timedelta(seconds=time_symbol_to_seconds(expires_delta))
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=7)

    token = binascii.hexlify(os.urandom(50)).decode()

    return token, expire
