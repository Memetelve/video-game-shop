import React from "react";
import Image from "next/image";
import Link from "next/link";

import StarRating from "./StarRating";
interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    reviews: number;
    average_rating: number;
    purchases: number;
}

export default function ItemCard({ item }: { item: Item }) {
    if (item.description.length > 100) {
        item.description = item.description.slice(0, 100) + "...";
    }

    return (
        <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
            <Link
                href={`/game/${item.id}`}
                className="item-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden"
            >
                <div className="relative pb-48 overflow-hidden">
                    <Image
                        className="absolute inset-0 h-full w-full object-cover"
                        src={item.image}
                        alt=""
                        layout="fill"
                    />
                </div>
                <div className="p-4">
                    <h2 className="mt-2 mb-2  font-bold">{item.name}</h2>
                    <p className="text-sm h-16">{item.description}</p>
                    <div className="mt-3 flex items-center">
                        <span className="text-sm font-semibold">$</span>
                        <span className="font-bold text-xl">{item.price}</span>
                        &nbsp;
                    </div>
                </div>
                <StarRating
                    rating={item.average_rating}
                    numReviews={item.reviews}
                />
            </Link>
        </div>
    );
}
