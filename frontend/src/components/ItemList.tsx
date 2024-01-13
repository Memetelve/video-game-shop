import react, { useState, useEffect } from "react";

import ItemCard from "./ItemCard";
import constants from "@/../config.json";
import Link from "next/link";

export default function ItemList() {
    const [items, setItems] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        fetch(`${constants.API_DOMAIN}/api/v1/items/`)
            .then((response) => response.json())
            .then((data) => {
                setItems(data.items);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <div className="flex flex-wrap -mx-4">
            {Object.keys(items).map((key) => {
                return <ItemCard key={key} item={items[key]} />;
            })}
        </div>
    );
}
