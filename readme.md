# Welcome to video-game-shop, your generic online shop

## Notes for author

- Adding a game (cypher query)

```cypher
MATCH (i:Item)
WITH COUNT(i) + 1 AS new_id
CREATE (:Item {name: "Game name", description: "Game description", price: 10.0, image: "https://image.url", id: new_id})
```

- Adding a tag (cypher query)

```cypher
match (i:Item {name: "Fortnite"})
merge (t:Tag {name: "Arcade"})
create (i)-[:CATEGORIZED_AS]->(t)
```
