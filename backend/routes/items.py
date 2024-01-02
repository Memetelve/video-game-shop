from fastapi import APIRouter

from models.filters import GameTagFilter
from helpers import get_driver, is_accepted_by_filter

items = APIRouter(prefix="/api/v1", tags=["items", "games"])
driver = get_driver()


@items.get("/items")
async def get_items():
    cypher_query = "MATCH (u:User)-[r:OWNS]->(i:Item) RETURN i, count(r) as Relations ORDER BY Relations DESC LIMIT 20"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        print(result)

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


@items.get("/items/{item_id}")
async def get_item(item_id: str):
    cypher_query = f"MATCH (i:Item) WHERE i.id = '{item_id}' RETURN i"
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


@items.get("/items/search/{query}")
async def search_items(query: str, filters: GameTagFilter = None):
    cypher_query = f"MATCH (i:Item) WHERE i.name CONTAINS '{query}' RETURN i"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

    result_items = []
    for item in result:
        item = item[0]

        if not is_accepted_by_filter(item, filters):
            continue

        result_items.append(
            {
                "id": item["id"],
                "name": item["name"],
                "price": item["price"],
                "description": item["description"],
                "image": item["image"],
            }
        )

    return {"msg": "Items fetched successfully", "items": result_items}
