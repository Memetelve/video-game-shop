"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/components/Context";
import { useFormik } from "formik";
import CardSelector from "@/components/CardSelector";
import constants from "@/../config.json";
import Image from "next/image";
import TextField from "@mui/material/TextField";

export default function PurchaseGame() {
    const router = useRouter();
    const pathname = usePathname();
    const context = useAppContext();
    const gameId = Number(pathname.split("/")[2]);

    const [item, setItem] = useState({
        id: 0,
        name: "",
        description: "",
        price: 0,
        image: "",
    });

    useEffect(() => {
        fetch(`${constants.API_DOMAIN}/api/v1/items/id/${gameId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${context.sessionToken}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);

                setItem(res.item);
            });
    }, [context.sessionToken, gameId]);

    const formik = useFormik({
        initialValues: {
            cardNumber: "",
            cardHolder: "",
            expirationDate: "",
            cvv: "",
            coupon: "",
        },
        onSubmit: (values) => {
            const body = {
                item: {
                    id: gameId,
                },
                card: {
                    card_number: values.cardNumber,
                    card_holder: values.cardHolder,
                    expiration_date: values.expirationDate,
                    cvv: values.cvv,
                },
                coupon: {
                    code: values.coupon,
                },
            };

            console.log(body);

            fetch(`${constants.API_DOMAIN}/api/v1/items/add-purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${context.sessionToken}`,
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    router.push("/library");
                });
        },
    });

    return (
        <div className="grid h-screen place-items-center bg-neutral-900">
            <div className="bg-neutral-700 rounded-md">
                <Image
                    className="rounded-t-md max-h-96"
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={300}
                />
                <h1 className="text-2xl text-white text-center font-bold mt-8 logo-font p-6">
                    Purchase {item.name}
                </h1>
                <div className="text-center mb-4 text-lg">
                    Price: ${item.price?.toFixed(2)}
                </div>

                <form onSubmit={formik.handleSubmit} className="justify-center">
                    <div className="flex justify-center flex-col items-center">
                        <TextField
                            className="w-60 bg-slate-400"
                            id="coupon"
                            name="coupon"
                            label="Coupon code"
                            variant="outlined"
                            onChange={formik.handleChange}
                        />
                        <CardSelector formik={formik} />
                        <button className="bg-sky-800 text-white px-6 py-3 mb-4 -mt-2 rounded-lg font-bold hover:bg-sky-600">
                            Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
