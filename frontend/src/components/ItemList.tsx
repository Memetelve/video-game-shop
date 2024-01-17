import react, { useState, useEffect } from "react";

import ItemCard from "./ItemCard";
import constants from "@/../config.json";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

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
        <div>
            <SearchBar setItems={setItems} />
            <div className="flex flex-wrap -mx-4">
                {items && items.length > 0 ? (
                    Object.keys(items).map((key) => {
                        return <ItemCard key={key} item={items[key]} />;
                    })
                ) : (
                    <div className="flex flex-col justify-center items-center w-full h-96">
                        <h1 className="text-4xl font-bold text-white">
                            No items found
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}
