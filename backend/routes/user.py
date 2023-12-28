from fastapi import APIRouter

from helpers import get_driver

user = APIRouter(prefix="/api/v1/user", tags=["user"])
driver = get_driver()


@user.get("/{user_id}")
async def get_user(user_id: str):
    cypher_query = f"MATCH (u:User) WHERE u.id = '{user_id}' RETURN u"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"msg": "User does not exist"}

        user = result[0][0]

        return {
            "msg": "User fetched successfully",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "created_at": user["created_at"],
            },
        }
