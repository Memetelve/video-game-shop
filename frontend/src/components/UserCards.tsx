import React, { useEffect, useState } from "react";
import constants from "../../config.json";

export default function UserCards() {
    const [userCards, setUserCards] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const getUserCards = async () => {
            const res = await fetch(
                `${constants.API_DOMAIN}/api/v1/user/get-cards`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "sessionToken"
                        )}`,
                    },
                }
            );
            const data = await res.json();
            console.log(data);

            setUserCards(
                data.cards.map((card: any) => {
                    return {
                        name: card.card_holder,
                        number: card.card_number,
                        cvv: card.cvv,
                        expiry: card.expiration_date,
                    };
                })
            );
        };

        getUserCards();
    }, [refresh]);

    return (
        <div className="text-white text-center flex-1">
            <h1 className="text-2xl font-bold">User Cards</h1>
            <div className="flex flex-row flex-wrap justify-center">
                {userCards.map((card: any) => (
                    <div
                        key={card.id}
                        className="bg-sky-700 rounded-md m-2 p-2 flex flex-row items-center"
                    >
                        <p className="mr-12">{card.name}</p>
                        <p className="mr-12">{card.number}</p>
                        <p className="mr-12">{card.cvv}</p>
                        <p className="mr-12">{card.expiry}</p>
                        <button
                            className="bg-red-500 rounded-md p-2"
                            onClick={async () => {
                                const res = await fetch(
                                    `${constants.API_DOMAIN}/api/v1/user/delete-card`,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem(
                                                "sessionToken"
                                            )}`,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            card_number: card.number,
                                            card_holder: card.name,
                                            cvv: card.cvv,
                                            expiration_date: card.expiry,
                                        }),
                                    }
                                );
                                const data = await res.json();
                                console.log(data);

                                setRefresh(!refresh);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
