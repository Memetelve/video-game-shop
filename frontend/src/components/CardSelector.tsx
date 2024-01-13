import React, { useLayoutEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import constants from "../../config.json";

interface Card {
    holderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export default function CardSelector({ formik }: { formik: any }) {
    const [cards, setCards] = useState<Card[]>([]);

    useLayoutEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken") || "";

        fetch(`${constants.API_DOMAIN}/api/v1/user/get-cards`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setCards(
                    res.cards.map((card: any) => ({
                        holderName: card.card_holder,
                        cardNumber: card.card_number,
                        expiryDate: card.expiration_date,
                        cvv: card.cvv,
                    }))
                );
            });
    }, []);

    return (
        <div className="flex justify-center">
            {cards.length > 0 ? (
                <FormControl className="w-60 bg-slate-400 my-6">
                    <InputLabel id="card-select-label">Card</InputLabel>
                    <Select
                        labelId="card-select-label"
                        id="card-select"
                        value={formik.values.cardNumber}
                        onChange={(e) => {
                            formik.setFieldValue("cardNumber", e.target.value);
                            formik.setFieldValue(
                                "cardHolder",
                                cards.find(
                                    (card) => card.cardNumber === e.target.value
                                )?.holderName
                            );
                            formik.setFieldValue(
                                "expirationDate",
                                cards.find(
                                    (card) => card.cardNumber === e.target.value
                                )?.expiryDate
                            );
                            formik.setFieldValue(
                                "cvv",
                                cards.find(
                                    (card) => card.cardNumber === e.target.value
                                )?.cvv
                            );

                            console.log(formik.values);
                            console.log(cards);
                        }}
                        error={
                            formik.touched.card && Boolean(formik.errors.card)
                        }
                    >
                        {cards.map((card, index) => (
                            <MenuItem key={index} value={card.cardNumber}>
                                {card.cardNumber}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {formik.touched.card && formik.errors.card}
                    </FormHelperText>
                </FormControl>
            ) : (
                <div className="text-red-300 font-bold my-6">
                    You have no saved cards, please add some in your settings
                </div>
            )}
        </div>
    );
}
