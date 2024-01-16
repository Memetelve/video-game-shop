from fastapi import APIRouter, Depends

from helpers import get_driver, get_bearer_token

admin = APIRouter(prefix="/api/v1/admin", tags=["admin"])
driver = get_driver()


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

        return {"detail": "Great success", "data": result[0]["data"]}
