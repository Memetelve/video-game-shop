import requests
import asyncio

from neo4j import AsyncGraphDatabase


async def get_driver():
    # TODO: Add this to config file
    return AsyncGraphDatabase.driver(
        "bolt://localhost:7687", auth=("neo4j", "mmmmmmmm")
    )


games_url = "https://steamspy.com/api.php?request=all&page=0"
games = requests.get(games_url).json()

driver = asyncio.run(get_driver())


async def main():
    index = 0
    async with driver.session() as session:
        for game_key in games.keys():
            print(f"Processing game {index} of {len(games)} | id: {game_key}")
            game = requests.get(
                f"https://store.steampowered.com/api/appdetails?appids={game_key}"
            ).json()[game_key]["data"]

            if game["is_free"]:
                price = 0
            else:
                price = game["price_overview"]["final"] / 100

            result = await session.run(
                """
MATCH (i:Item)
WITH COUNT(i) + 1 AS new_id
MERGE (:Item {name: $name, description: $description, price: $price, image: $image, id: new_id})
    """,
                name=game["name"],
                price=price,
                description=game["about_the_game"],
                image=game["header_image"],
            )

            async for record in result:
                print(record)

            index += 1

            if index > 100:
                break


if __name__ == "__main__":
    asyncio.run(main())
