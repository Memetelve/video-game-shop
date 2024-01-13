import React from "react";

export default function StarRating({
    rating,
    numReviews,
}: {
    rating: number;
    numReviews: number;
}) {
    const stars = Math.round(rating);

    if (numReviews === null) {
        numReviews = 0;
    }

    const starArray = Array.apply(null, Array(5)).map(function (x, i) {
        const color = i < stars ? "text-yellow-400" : "text-gray-400";

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
    });

    return (
        <div className="p-4 flex items-center text-sm text-gray-600">
            {starArray}
            <span className="ml-2">
                {numReviews} review{numReviews === 1 ? "" : "s"}
            </span>
        </div>
    );
}
