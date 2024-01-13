import React, { useState, useEffect } from "react";
import constants from "../../config.json";

interface Review {
    username: string;
    text: string;
    stars: number;
    datetime: string;
}

export default function ItemReviews({
    itemId,
    refresh,
}: {
    itemId: number;
    refresh: () => void;
}) {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch(`${constants.API_DOMAIN}/api/v1/items/comments/${itemId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setReviews(data.comments);
            })
            .catch((error) => console.error("Error:", error));
    }, [itemId, refresh]);

    return (
        <div className="w-5/6 mr-12">
            <h2 className="text-3xl font-bold mb-2 text-slate-300">Reviews</h2>
            {reviews.length > 0 ? (
                <div className="flex flex-wrap -mx-4">
                    {reviews.map((review, index) => {
                        return (
                            <div
                                key={index}
                                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
                            >
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            {Array.apply(null, Array(5)).map(
                                                function (x, i) {
                                                    const color =
                                                        i < review.stars
                                                            ? "text-yellow-400"
                                                            : "text-gray-400";
                                                    return (
                                                        <svg
                                                            key={i}
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 fill-current ${color}`}
                                                        >
                                                            <path d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0 1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514 1.514 0 0 1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35L8.66 7.73l1.925-3.862c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662 0c.25.153.45.373.577.633l1.925 3.847 4.334.615c.29.042.562.162.785.348.224.186.39.43.48.704a1.514 1.514 0 0 1-.404 1.58l-3.13 3 .736 4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582 1.582 0 0 1-1.643.117l-3.865-2-3.865 2z"></path>
                                                        </svg>
                                                    );
                                                }
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-slate-200">
                                                {review.username}
                                            </p>
                                            <p className="text-slate-200 text-sm">
                                                {review.datetime}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-slate-200 overflow-clip">
                                        {review.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-slate-200">No reviews yet.</p>
            )}
        </div>
    );
}
