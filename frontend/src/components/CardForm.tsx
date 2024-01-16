import React from "react";
import constants from "../../config.json";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CardForm() {
    const validationSchema = Yup.object({
        cardNumber: Yup.string().min(16).max(16).required(),
        cardName: Yup.string().min(3).max(20).required(),
        cardExpiration: Yup.string().min(4).max(4).required(),
        cardCvv: Yup.string().min(3).max(3).required(),
    });

    const formik = useFormik({
        initialValues: {
            cardNumber: "",
            cardName: "",
            cardExpiration: "",
            cardCvv: "",
        },
        onSubmit: (values) => {
            const body = {
                card_number: values.cardNumber,
                card_holder: values.cardName,
                expiration_date: values.cardExpiration,
                cvv: values.cardCvv,
            };

            fetch(`${constants.API_DOMAIN}/api/v1/user/add-card`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "sessionToken"
                    )}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                });
        },
    });

    return (
        <div className="text-white text-center">
            <h1 className="text-2xl font-bold">Add a card</h1>
            <form
                className="flex flex-col items-center"
                onSubmit={formik.handleSubmit}
            >
                <input
                    className="bg-sky-700 rounded-md m-2 p-2"
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    onChange={formik.handleChange}
                    value={formik.values.cardNumber}
                />
                <input
                    className="bg-sky-700 rounded-md m-2 p-2"
                    type="text"
                    name="cardName"
                    placeholder="Card Name"
                    onChange={formik.handleChange}
                    value={formik.values.cardName}
                />
                <input
                    className="bg-sky-700 rounded-md m-2 p-2"
                    type="text"
                    name="cardExpiration"
                    placeholder="Card Expiration"
                    onChange={formik.handleChange}
                    value={formik.values.cardExpiration}
                />
                <input
                    className="bg-sky-700 rounded-md m-2 p-2"
                    type="text"
                    name="cardCvv"
                    placeholder="Card CVV"
                    onChange={formik.handleChange}
                    value={formik.values.cardCvv}
                />
                <button className="bg-sky-700 rounded-md m-2 p-2" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}
