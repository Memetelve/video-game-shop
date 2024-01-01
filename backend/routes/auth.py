from uuid import uuid4
from fastapi import APIRouter, HTTPException, Header, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.users import UserRegistration, UserLogin
from helpers import (
    get_driver,
    create_password_hash,
    is_username_valid,
    is_email_valid,
    is_password_valid,
    create_access_token_with_time,
)

bearer_scheme = HTTPBearer()


def get_bearer_token(
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    return authorization.credentials


auth = APIRouter(prefix="/auth", tags=["auth"])
driver = get_driver()


@auth.post("/login")
async def login_user(login: UserLogin):
    if is_email_valid(login.username):
        email = login.username
        cypher_query = f'MATCH (u:User) WHERE u.email = "{email}" RETURN u'
    else:
        username = login.username
        cypher_query = f'MATCH (u:User) WHERE u.username = "{username}" RETURN u'

    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            raise HTTPException(
                400,
                detail="User with this username or email does not exist",
            )

        user = result[0][0]

        if user["password"] != create_password_hash(login.password):
            raise HTTPException(
                400,
                detail="Invalid password",
            )

        acces_token, time = create_access_token_with_time()

        await session.run(
            "MATCH (u:User {username: $username}) CREATE (t:Token {token: $token, time: $time}) CREATE (u)-[:USES_TOKEN]->(t)",
            username=user["username"],
            token=acces_token,
            time=str(time),
        )

        return {
            "msg": "User logged in successfully",
            "token": acces_token,
            "token_validity_time": time,
        }


@auth.post("/register", status_code=201)
async def register_user(user: UserRegistration):
    if not is_username_valid(user.username):
        raise HTTPException(
            400,
            detail="Username must contain only letters, numbers, and '._-'. Valid username must be between 3 and 24 characters long.",
        )

    if not is_email_valid(user.email):
        raise HTTPException(
            400,
            detail="Invalid email address",
        )

    if not is_password_valid(user.password):
        raise HTTPException(
            400,
            detail="Password must be between 8 and 64 characters long. It must contain at least one special character, one number, and one big letter.",
        )

    username = user.username
    email = user.email

    async with driver.session() as session:
        result = await session.run(
            f'MATCH (u:User) WHERE u.username = "{username}" OR u.email = "{email}"  RETURN u'
        )

        result = await result.values()

        if result != []:
            raise HTTPException(
                400,
                detail="User with this username or email already exists",
            )

        password_hash = create_password_hash(user.password)
        acces_token, time = create_access_token_with_time()

        await session.run(
            "CREATE (u:User {username: $username, email: $email, password: $password, id: $id}) CREATE (t:Token {token: $token, time: $time}) CREATE (u)-[:USES_TOKEN]->(t)",
            username=user.username,
            email=user.email,
            password=password_hash,
            id=uuid4().hex,
            token=acces_token,
            time=str(time),
        )

        return {
            "msg": "User created successfully",
            "token": acces_token,
            "token_validity_time": time,
        }


@auth.post("/logout")
async def logout_user(token: str = Depends(get_bearer_token)):
    print(token)

    async with driver.session() as session:
        await session.run(
            "MATCH (t:Token) WHERE t.token = $token DETACH DELETE t",
            token=token,
        )

        # We do not really care if the token was real. If it was not, it will not be deleted. User will still be logged out.

        return {
            "msg": "User logged out successfully",
        }
