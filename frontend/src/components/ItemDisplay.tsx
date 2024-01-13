import React, { useState, useEffect } from "react";
import constants from "../../config.json";
import Image from "next/image";

export default function ItemDisplay({ itemId }: { itemId: number }) {
    const [item, setItem] = useState({
        id: 0,
        name: "",
        description: "",
        price: 0,
        image: "",
    });

    useEffect(() => {
        fetch(`${constants.API_DOMAIN}/api/v1/items/id/${itemId}`)
            .then((response) => response.json())
            .then((data) => {
                setItem(data.item);
            })
            .catch((error) => console.error("Error:", error));
    }, [itemId]);

    return (
        <div className="flex flex-wrap -mx-4 text-zinc-300">
            <div className="w-full md:w-1/2 lg:w-1/3 px-4">
                <div className="relative">
                    <Image
                        src={
                            item.image
                                ? item.image
                                : "https://cdn.discordapp.com/attachments/1195448866514931783/1195779636030881933/zIsI5gJ.jpg?ex=65b53b91&is=65a2c691&hm=ed1acebcd365d582eb6b3d290ed25a4f1374e3b0dc1df80a609390854080ed89&"
                        }
                        alt={item.name}
                        className="w-full rounded-lg"
                        width={500}
                        height={500}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black via-transparent"></div>
                </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-2/3 px-4">
                <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                <p className="text-xl font-semibold mb-2">
                    ${item.price?.toFixed(2)}
                </p>
                <p className="text-slate-200 mb-4">{item.description}</p>
                <div className="flex items-center">
                    <button className="bg-sky-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-sky-600 mt-6">
                        Get this game
                    </button>
                </div>
            </div>
        </div>
    );
}
