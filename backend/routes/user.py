from fastapi import APIRouter, Depends, HTTPException

from models.users import PaymentCard, UserUpdate

from helpers import get_driver, get_bearer_token, is_user_authenticated

user = APIRouter(prefix="/api/v1/user", tags=["user"])
driver = get_driver()


def create_update_user_query(data):
    for key in list(data.keys()):
        if data[key] is None:
            del data[key]

    set_clause = ", ".join(f"u.{key} = '{value}'" for key, value in data.items())
    return f"SET {set_clause}"


@user.get("/id/{user_id}")
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


@user.post("/add-card")
async def add_card(card: PaymentCard, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = """
MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token
MERGE (c:Card {card_number: $card_number, card_holder: $card_holder, expiration_date: $expiration_date, cvv: $cvv})
MERGE (u)-[:HAS_CARD]->(c)
RETURN u, c
"""
        await session.run(
            cypher_query,
            token=token,
            card_number=card.card_number,
            card_holder=card.card_holder,
            expiration_date=card.expiration_date,
            cvv=card.cvv,
        )

        return {"msg": "Card added successfully"}


@user.delete("/delete-card")
async def delete_card(card: PaymentCard, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = """
MATCH (t:Token)<-[:USES_TOKEN]-(u:User)-[r:HAS_CARD]->(c:Card) WHERE t.token = $token AND c.card_number = $card_number
DELETE r
"""

        await session.run(
            cypher_query,
            token=token,
            card_number=card.card_number,
        )

        return {"msg": "Card deleted successfully"}


@user.get("/get-cards")
async def get_cards(token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = """
MATCH (u:User)-[:USES_TOKEN]->(t:Token), (u)-[:HAS_CARD]->(c:Card) WHERE t.token = $token
RETURN c
"""

        result = await session.run(
            cypher_query,
            token=token,
        )

        result = await result.values()
        cards = []
        for card in result:
            cards.append(card[0])

    return {"msg": "Cards fetched successfully", "cards": cards}


@user.patch("/update")
async def update_user(user: UserUpdate, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        set_statement = create_update_user_query(user.model_dump())

        query = (
            "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token "
            + set_statement
        )

        await session.run(query, token=token)

    return {"msg": "User updated successfully"}


@user.get("/transactions")
async def get_transactions(token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token), (u)-[r:BOUGHT]->(i:Item) WHERE t.token = $token RETURN r, i"

        result = await session.run(cypher_query, token=token)
        result = await result.values()
        transactions = []

        for transaction in result:
            transactions.append(
                {
                    "id": transaction[0]["transaction_id"],
                    "price": transaction[0]["price"],
                    "datetime": transaction[0]["datetime"],
                    "card": "**** **** **** " + transaction[0]["card"],
                    "returned": transaction[0]["returned"],
                    "type": "bought",
                    "itemName": transaction[1]["name"],
                    "itemImage": transaction[1]["image"],
                }
            )

            if transaction[0]["returned"]:
                transactions.append(
                    {
                        "id": transaction[0]["transaction_id"],
                        "price": transaction[0]["price"],
                        "datetime": transaction[0]["return_datetime"],
                        "card": "**** **** **** " + transaction[0]["card"],
                        "returned": True,
                        "type": "returned",
                        "itemName": transaction[1]["name"],
                        "itemImage": transaction[1]["image"],
                    }
                )

        # sort transactions by datetime

        transactions.sort(key=lambda x: x["datetime"], reverse=True)

    return {"msg": "Transactions fetched successfully", "transactions": transactions}


@user.get("/notifications")
async def get_notifications(token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token), (u)-[r:BOUGHT]->(i:Item) WHERE t.token = $token RETURN r, i"

        result = await session.run(cypher_query, token=token)
        result = await result.values()
        notifications = []

        for transaction in result:
            notifications.append(
                {
                    "text": f"You just bought {transaction[1]['name']} for {transaction[0]['price']:.2f}$",
                    "datetime": transaction[0]["datetime"],
                }
            )

            if transaction[0]["returned"]:
                notifications.append(
                    {
                        "text": f"You just returned {transaction[1]['name']}",
                        "datetime": transaction[0]["return_datetime"],
                    }
                )

        # sort transactions by datetime

        notifications.sort(key=lambda x: x["datetime"], reverse=True)

    return {"msg": "Notifications fetched successfully", "notifications": notifications}
