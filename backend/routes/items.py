from datetime import datetime
from fastapi import APIRouter, Depends

from models.users import PaymentCard
from models.items import Item, Comment, Coupon
from models.filters import GameTagFilter
from helpers import (
    get_driver,
    is_accepted_by_filter,
    get_bearer_token,
    create_transaction_id,
)

items = APIRouter(prefix="/api/v1/items", tags=["items", "games"])
driver = get_driver()


@items.get("/")
async def get_items():
    cypher_query = "MATCH (u:User)-[r:BOUGHT]->(i:Item) RETURN i, count(r) as Relations ORDER BY Relations DESC LIMIT 20"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if len(result) < 20:
            print("less than 20")

            new_limit = 20 - len(result)
            helper_query = (
                "MATCH (i:Item) WHERE NOT EXISTS { MATCH (c)-[:BOUGHT]->(i) RETURN true } RETURN i LIMIT %s"
                % (new_limit)
            )

            helper_result = await session.run(helper_query)
            helper_result = await helper_result.values()
            result += helper_result

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

        return {"msg": "Items fetched successfully", "items": items}


@items.get("by_id/{item_id}")
async def get_item(item_id: int):
    cypher_query = f"MATCH (i:Item) WHERE i.id = {item_id} RETURN i"
    async with driver.session() as session:
        result = await session.run(cypher_query)
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


@items.get("/search/{item_query}")
async def search_items(item_query: str, filters: GameTagFilter = None):
    cypher_query = "MATCH (i:Item) WHERE i.name CONTAINS $item_query OPTIONAL MATCH (i)-[:CATEGORIZED_AS]->(t) RETURN i, COLLECT(t) as tags"
    async with driver.session() as session:
        result = await session.run(cypher_query, item_query=item_query)
        result = await result.values()

    result_items = []
    for item in result:
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
            }
        )

    return {"msg": "Items fetched successfully", "items": result_items}


@items.post("/add-favorite")
async def add_favorite(item: Item, token: str = Depends(get_bearer_token)):
    cypher_query = (
        f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' RETURN u"
    )
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        print(item.id)

        if result == []:
            return {"msg": "User does not exist"}

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (i:Item) WHERE i.id = $id CREATE (u)-[:FAVORITE]->(i)"

        await session.run(cypher_query, token=token, id=item.id)

    return {"msg": "Favorite added successfully"}


@items.delete("/delete-favorite")
async def delete_favorite(item: Item, token: str = Depends(get_bearer_token)):
    cypher_query = (
        f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' RETURN u"
    )
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"msg": "User does not exist"}

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (u)-[r:FAVORITE]->(i:Item) WHERE i.id = $item_id DELETE r"

        await session.run(cypher_query, token=token, item_id=item.id)

    return {"msg": "Favorite deleted successfully"}


@items.get("/favorites")
async def get_favorites(token: str = Depends(get_bearer_token)):
    cypher_query = (
        f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' RETURN u"
    )
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"msg": "User does not exist"}

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
    cypher_query = (
        f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' RETURN u"
    )
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"msg": "User does not exist"}

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


@items.post("/add-purchase")
async def add_purchase(
    item: Item,
    card: PaymentCard,
    coupon: Coupon,
    token: str = Depends(get_bearer_token),
):
    cypher_query = (
        f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' RETURN u"
    )
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        card_last_four = card.card_number[-4:]
        transaction_id = create_transaction_id()

        if result == []:
            return {"msg": "User does not exist"}

        cypher_query = "MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = $token MATCH (i:Item) WHERE i.id = $id CREATE (u)-[:BOUGHT {}]->(i)"

        await session.run(cypher_query, token=token, id=item.id)

    return {"msg": "Purchase added successfully"}
