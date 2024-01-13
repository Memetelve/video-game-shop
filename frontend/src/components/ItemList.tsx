import react, { useState, useEffect } from "react";

import ItemCard from "./ItemCard";
import constants from "@/../config.json";

export default function ItemList() {
    const [items, setItems] = useState<{ [key: string]: any }>({}); // Add type annotation for items

    useEffect(() => {
        fetch(`${constants.API_DOMAIN}/api/v1/items/`)
            .then((response) => response.json())
            .then((data) => {
                setItems(data.items);
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap -mx-4">
                {Object.keys(items).map((key) => {
                    console.log(items);
                    console.log(items[key][0]);
                    return <ItemCard key={key} item={items[key]} />;
                })}
            </div>
        </div>
    );
}
