"use client";

import React, { useEffect, useState } from "react";
import constants from "@/../config.json";
import Image from "next/image";
import { Button } from "@nextui-org/react";

interface Transaction {
    id: number;
    type: string;
    price: number;
    datetime: string;
    itemName: string;
    itemImage: string;
    returned: boolean;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [reload, setReload] = useState(false);

    const getTransactions = async () => {
        const res = await fetch(
            `${constants.API_DOMAIN}/api/v1/user/transactions`,
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

        setTransactions(data.transactions);
    };

    useEffect(() => {
        getTransactions();
    }, [reload]);

    return (
        <div className="flex flex-col mx-24 mt-16">
            {transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                    const color =
                        transaction.type === "bought" ? "green" : "red";

                    const buttonColor = transaction.returned
                        ? "gray-500"
                        : "sky-950";

                    const refund = async () => {
                        console.log(transaction.id);

                        console.log(
                            JSON.stringify({
                                transaction_id: transaction.id,
                            })
                        );

                        const res = await fetch(
                            `${constants.API_DOMAIN}/api/v1/items/refund`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "sessionToken"
                                    )}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    transaction_id: transaction.id,
                                }),
                            }
                        );

                        setReload(!reload);
                    };

                    return (
                        <div
                            key={index}
                            className={`flex flex-row w-full h-24 bg-${color}-300 rounded-md text-slate-700 shadow-md mb-4`}
                        >
                            <Image
                                className="rounded-l-md"
                                src={transaction.itemImage}
                                alt="image"
                                width={100}
                                height={100}
                            />

                            <div className="flex flex-grow flex-row items-center justify-between mx-12">
                                <div className="text-2xl font-bold">
                                    ${transaction.price.toFixed(2)}
                                </div>
                                <div className="text-lg">
                                    {transaction.type}
                                </div>
                                <div className="text-2xl font-bold">
                                    {transaction.datetime}
                                </div>
                                <Button
                                    {...(transaction.returned
                                        ? { disabled: true }
                                        : {})}
                                    className={`rounded-md text-white bg-${buttonColor} p-4`}
                                    onClick={refund}
                                >
                                    Refund
                                </Button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col w-full h-full justify-center items-center">
                    <div className="text-2xl font-bold">
                        Loading...(or you didnt buy nothing)
                    </div>
                    <div className="bg-red-300"></div>
                    <div className="bg-sky-950"></div>
                    <div className="bg-gray-500"></div>
                    <div className="bg-green-300"></div>
                </div>
            )}
        </div>
    );
}
