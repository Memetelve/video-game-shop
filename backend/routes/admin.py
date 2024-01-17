from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile
from pydantic import BaseModel

from helpers import get_driver, get_bearer_token

admin = APIRouter(prefix="/api/v1/admin", tags=["admin"])
driver = get_driver()


class NewItem(BaseModel):
    name: str
    description: str
    price: float
    image_url: str


@admin.get("/database-file")
async def get_database_file(token: str = Depends(get_bearer_token)):
    cypher_query = f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' AND u.role = 'admin' RETURN u"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"detail": "You are not admin"}

        cypher_query = (
            "CALL apoc.export.json.all(null, {stream: true}) YIELD data RETURN data"
        )

        result = await session.run(cypher_query)
        result = await result.data()

        timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

        return {
            "detail": "Great success",
            "data": result[0]["data"],
            "filename": f"db-snapshop-{timestamp}.txt",
        }


@admin.post("/database-file")
async def post_database_file(
    file: UploadFile,
    token: str = Depends(get_bearer_token),
):
    cypher_query = f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' AND u.role = 'admin' RETURN u"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()
        if result == []:
            return {"detail": "You are not admin"}

        await session.run("MATCH (n) DETACH DELETE n")

        file_content = await file.read()
        file_content = file_content.decode("utf-8")
        file_content = file_content.split("\n")

        for i, x in enumerate(file_content):
            length = len(file_content)
            print(f"{i} of {length - 1}")
            cypher_query = """
WITH apoc.util.compress($data, {compression: 'DEFLATE'}) AS jsonCompressed
CALL apoc.import.json(jsonCompressed, {compression: 'DEFLATE'})
YIELD source, format, nodes, relationships, properties
RETURN source, format, nodes, relationships, properties
            """

            x = (
                str(x)
                .replace("': True", "': true")
                .replace("': False", "': false")
                .replace("'", r"\'")
            )

            result = await session.run(
                cypher_query,
                data=x,
            )

            x = await result.values()
            print(x)

        return {"detail": "Great success"}


@admin.post("/items/add")
async def post_item(
    item: NewItem,
    token: str = Depends(get_bearer_token),
):
    cypher_query = f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' AND u.role = 'admin' RETURN u"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"detail": "You are not admin"}

        cypher_query = """
MATCH (i:Item)
WITH COUNT(i) + 1 AS new_id
CREATE (i:Item {name: $name, description: $description, price: $price, image: $image_url, id: new_id})
        """

        await session.run(
            cypher_query,
            name=item.name,
            description=item.description,
            price=item.price,
            image_url=item.image_url,
        )

        return {"detail": "Great success"}


@admin.delete("/items/delete")
async def delete_item(
    id: int,
    token: str = Depends(get_bearer_token),
):
    cypher_query = f"MATCH (u:User)-[:USES_TOKEN]->(t:Token) WHERE t.token = '{token}' AND u.role = 'admin' RETURN u"
    async with driver.session() as session:
        result = await session.run(cypher_query)
        result = await result.values()

        if result == []:
            return {"detail": "You are not admin"}

        cypher_query = """
MATCH (i:Item {id: $id})
DETACH DELETE i
        """

        await session.run(
            cypher_query,
            id=id,
        )

        return {"detail": "Great success"}
