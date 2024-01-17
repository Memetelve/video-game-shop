import React from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import constants from "@/../config.json";

import { convertPrice } from "@/app/helpers/currency";

export default function SearchBar({ setItems }: { setItems: any }) {
    const formik = useFormik({
        initialValues: {
            search: "",
            category: "all",
            min_price: "",
            max_price: "",
        },
        onSubmit: (values) => {
            const currency = localStorage.getItem("currency") || "EUR";

            console.log(values);

            const body: any = {};

            if (values.category !== "all") {
                body["tags"] = values.category;
            }

            if (values.min_price !== "") {
                body["price_gte"] = convertPrice(
                    Number(values.min_price).valueOf(),
                    currency
                );
            }

            if (values.max_price !== "") {
                body["price_lte"] = convertPrice(
                    Number(values.max_price).valueOf(),
                    currency
                );
            }

            fetch(
                `${constants.API_DOMAIN}/api/v1/items/search/${values.search}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.items);

                    setItems(data.items);
                })
                .catch((error) => console.error("Error:", error));
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col">
                <div className="text-white flex flex-row justify-center">
                    <input
                        onChange={formik.handleChange}
                        name="search"
                        id="search"
                        value={formik.values.search}
                        placeholder="Search for an item"
                        className="bg-neutral-800 rounded-lg p-2 w-1/2"
                        type="text"
                    />
                    <button
                        className="bg-neutral-700 rounded-lg p-2 ml-6 w-24"
                        type="submit"
                    >
                        Search
                    </button>

                    <button
                        className="bg-gray-700 rounded-lg p-2 ml-6 w-24 text-orange-400"
                        onClick={(e) => {
                            e.preventDefault();
                            formik.resetForm();
                        }}
                    >
                        Reset
                    </button>
                </div>
                <div className="text-white flex flex-row justify-center mt-6">
                    <select
                        name="category"
                        id="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        className="bg-neutral-800 rounded-lg p-2 w-32"
                    >
                        <option value="all">All</option>
                        <option value="fps">fps</option>
                        <option value="rpg">rpg</option>
                        <option value="mmorpg">mmorpg</option>
                        <option value="racing">racing</option>
                        <option value="horror">horror</option>
                        <option value="action">action</option>
                        <option value="adventure">adventure</option>
                        <option value="simulation">simulation</option>
                        <option value="strategy">strategy</option>
                        <option value="sports">sports</option>
                        <option value="puzzle">puzzle</option>
                        <option value="idle">idle</option>
                        <option value="clicker">clicker</option>
                        <option value="arcade">arcade</option>
                        <option value="platformer">platformer</option>
                        <option value="roguelike">roguelike</option>
                        <option value="open_world">open_world</option>
                        <option value="sandbox">sandbox</option>
                        <option value="survival">survival</option>
                        <option value="battle_royale">battle_royale</option>
                        <option value="shooter">shooter</option>
                    </select>
                    <input
                        onChange={formik.handleChange}
                        name="min_price"
                        id="min_price"
                        value={formik.values.min_price}
                        placeholder="min price"
                        className="bg-neutral-800 rounded-lg p-2 w-24 ml-6"
                        type="number"
                    />
                    <input
                        onChange={formik.handleChange}
                        name="max_price"
                        id="max_price"
                        value={formik.values.max_price}
                        placeholder="max price"
                        className="bg-neutral-800 rounded-lg p-2 w-24 ml-6"
                        type="number"
                    />
                </div>
            </div>
        </form>
    );
}
