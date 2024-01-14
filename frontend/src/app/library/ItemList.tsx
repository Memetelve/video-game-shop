import { useAppContext } from "@/components/Context";
import { useState, useEffect } from "react";

import ItemCard from "./ItemCard";
import constants from "@/../config.json";

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ItemList() {
    const context = useAppContext();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        if (!context.sessionToken) {
            return;
        }

        fetch(`${constants.API_DOMAIN}/api/v1/items/owned`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${context.sessionToken}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setItems(res.items);

                console.log(res.items);
            });
    }, [context.sessionToken]);

    return (
        <div className="flex flex-wrap -mx-4">
            {items ? (
                Object.keys(items).map((key) => {
                    return <ItemCard key={key} item={items[Number(key)]} />;
                })
            ) : (
                <></>
            )}
        </div>
    );
}
