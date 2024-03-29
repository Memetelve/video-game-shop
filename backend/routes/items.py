from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from models.users import PaymentCard
from models.items import Item, Comment, Coupon, Transaction
from models.filters import GameTagFilter
from helpers import (
    get_driver,
    is_accepted_by_filter,
    get_bearer_token,
    create_transaction_id,
    is_user_authenticated,
)

items = APIRouter(prefix="/api/v1/items", tags=["items"])
driver = get_driver()


@items.get("/")
async def get_items():
    cypher_query = """
MATCH (u:User)-[r:BOUGHT]->(i:Item)
OPTIONAL MATCH (u)-[c:COMMENTED_ABOUT]->(i)
RETURN i, count(r) as purchases, count(c) as reviews, avg(c.stars) as average_rating
ORDER BY purchases DESC
LIMIT 20
UNION
MATCH (i:Item) WHERE NOT EXISTS { MATCH (c)-[:BOUGHT]->(i) RETURN true }
OPTIONAL MATCH (u)-[c:COMMENTED_ABOUT]->(i)
RETURN i, 0 as purchases, count(c) as reviews, avg(c.stars) as average_rating
LIMIT 20
"""
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        items = []
        for item_full in result[:20]:
            item = item_full[0]

            items.append(
                {
                    "id": item["id"],
                    "name": item["name"],
                    "price": item["price"],
                    "description": item["description"],
                    "image": item["image"],
                    "purchases": item_full[1],
                    "reviews": item_full[2],
                    "average_rating": item_full[3],
                }
            )

        return {"msg": "Items fetched successfully", "items": items}


@items.get("/id/{item_id}")
async def get_item(item_id: int):
    cypher_query = "MATCH (i:Item) WHERE i.id = $item_id RETURN i"
    async with driver.session() as session:
        result = await session.run(cypher_query, item_id=item_id)
        result = await result.values()

        if result == []:
            return {"msg": "Item does not exist"}

        item = result[0][0]

        return {
            "msg": "Item fetched successfully",
            "item": {
                "id": item["id"],
                "name": item["name"],
                "price": item["price"],
                "description": item["description"],
                "image": item["image"],
            },
        }


@items.post("/search")
async def search_items(item_query: str = "", filters: GameTagFilter = None):
    cypher_query = "MATCH (i:Item) WHERE i.name CONTAINS $item_query OPTIONAL MATCH (i)-[:CATEGORIZED_AS]->(t) OPTIONAL MATCH (u)-[c:COMMENTED_ABOUT]->(i) RETURN i, COLLECT(t) as tags, count(c) as reviews, avg(c.stars) as average_rating"
    async with driver.session() as session:
        result = await session.run(cypher_query, item_query=item_query)
        result = await result.values()

    result_items = []
    for item in result:
        print(item)
        new_item = item[0]._properties
        if len(item[1]) > 0:
            new_item["tags"] = [tag._properties["name"] for tag in item[1]]
        else:
            new_item["tags"] = []

        if not is_accepted_by_filter(new_item, filters):
            continue

        result_items.append(
            {
                "id": new_item["id"],
                "name": new_item["name"],
                "price": new_item["price"],
                "description": new_item["description"],
                "image": new_item["image"],
                "tags": new_item["tags"],
                "purchases": item[1],
                "reviews": item[2],
                "average_rating": item[3],
            }
        )

    return {"msg": "Items fetched successfully", "items": result_items}


@items.post("/add-favorite")
async def add_favorite(item: Item, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (i:Item) WHERE i.id = $id CREATE (u)-[:FAVORITE]->(i)"

        await session.run(cypher_query, token=token, id=item.id)

    return {"msg": "Favorite added successfully"}


@items.delete("/delete-favorite")
async def delete_favorite(item: Item, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[r:FAVORITE]->(i:Item) WHERE i.id = $item_id DELETE r"

        await session.run(cypher_query, token=token, item_id=item.id)

    return {"msg": "Favorite deleted successfully"}


@items.get("/favorites")
async def get_favorites(token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[:FAVORITE]->(i:Item) RETURN i"

        result = await session.run(cypher_query, token=token)
        result = await result.values()

        items = []
        for item in result:
            item = item[0]
            items.append(
                {
                    "id": item["id"],
                    "name": item["name"],
                    "price": item["price"],
                    "description": item["description"],
                    "image": item["image"],
                }
            )

        return {"msg": "Favorites fetched successfully", "items": items}


@items.post("/add-comment")
async def add_comment(
    item: Item, comment: Comment, token: str = Depends(get_bearer_token)
):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (i:Item) WHERE i.id = $id CREATE (u)-[c:COMMENTED_ABOUT {text: $text, stars: $stars, datetime: $datetime}]->(i)"

        await session.run(
            cypher_query,
            token=token,
            id=item.id,
            text=comment.text,
            stars=comment.stars,
            datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        )

    return {"msg": "Comment added successfully"}


@items.get("/comments/{item_id}")
async def get_comments(item_id: int):
    cypher_query = "MATCH (i:Item) WHERE i.id = $item_id MATCH (u)-[c:COMMENTED_ABOUT]->(i) RETURN c, u"
    async with driver.session() as session:
        result = await session.run(cypher_query, item_id=item_id)
        result = await result.values()

        comments = []
        for comment in result:
            user = comment[1]
            comment = comment[0]
            comments.append(
                {
                    "username": user["username"],
                    "text": comment["text"],
                    "stars": comment["stars"],
                    "datetime": comment["datetime"],
                }
            )

        return {"msg": "Comments fetched successfully", "comments": comments}


@items.post("/add-purchase")
async def add_purchase(
    item: Item,
    card: PaymentCard,
    coupon: Coupon = None,
    token: str = Depends(get_bearer_token),
):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        # check if game bought already
        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[r:BOUGHT {returned: false}]->(i:Item) WHERE i.id = $item_id RETURN r"
        result = await session.run(cypher_query, token=token, item_id=item.id)
        result = await result.values()
        if result != []:
            return {"msg": "Item already bought"}

        cypher_query = "MATCH (i:Item) WHERE i.id = $item_id RETURN i"
        result = await session.run(cypher_query, item_id=item.id)
        result = await result.values()
        game = result[0][0]

        cypher_query = "MATCH (c:Coupon) WHERE c.code = $coupon_code RETURN c"

        if coupon is None:
            coupon_code = ""
        else:
            coupon_code = coupon.code

        result = await session.run(
            cypher_query, coupon_code=coupon_code, item_id=item.id
        )
        result = await result.values()

        if result == []:
            coupon = {"discount": 0.00}
        else:
            coupon = result[0][0]

        discount = coupon["discount"]
        final_price = max(game["price"] - discount, 0.00)

        card_last_four = card.card_number[-4:]
        transaction_id = create_transaction_id()

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (i:Item) WHERE i.id = $item_id CREATE (u)-[:BOUGHT {card: $card, transaction_id: $transaction_id, price: $price, datetime: $datetime, returned: False}]->(i)"

        result = await session.run(
            cypher_query,
            token=token,
            item_id=item.id,
            card=card_last_four,
            transaction_id=transaction_id,
            price=final_price,
            datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        )

    return {"msg": "Purchase added successfully"}


@items.get("/owned")
async def get_owned_items(token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[r:BOUGHT {returned: False}]->(i:Item) RETURN i, r"

        result = await session.run(cypher_query, token=token)
        result = await result.values()

        items = []
        for item in result:
            game = item[0]
            items.append(
                {
                    "id": game["id"],
                    "name": game["name"],
                    "price": game["price"],
                    "description": game["description"],
                    "image": game["image"],
                }
            )

        return {"msg": "Owned items fetched successfully", "items": items}


@items.post("/refund")
async def refund_item(transaction: Transaction, token: str = Depends(get_bearer_token)):
    async with driver.session() as session:
        if not await is_user_authenticated(token, session):
            return HTTPException(status_code=401, detail="Sesstion token not correct")

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[r:BOUGHT {transaction_id: $transaction_id}]->(i:Item) SET r.returned = True, r.return_datetime = $datetime"

        await session.run(
            cypher_query,
            token=token,
            transaction_id=transaction.transaction_id,
            datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        )

        return {"msg": "Item refunded successfully"}
