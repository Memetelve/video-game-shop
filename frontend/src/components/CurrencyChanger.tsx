import React, { useEffect, useReducer, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import constants from "../../config.json";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@nextui-org/react";

export default function CurrencyChanger() {
    const changeCurrency = async (currency: string) => {
        localStorage.setItem("currency", currency);
        location.reload();
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <button className="p-1 rounded-md bg-sky-700">
                    <span className="text-white">
                        {localStorage.getItem("currency") || "EUR"}
                    </span>
                </button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Static Actions"
                className="bg-slate-800 text-white rounded-lg p-2"
            >
                <DropdownItem>
                    <button
                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                        onClick={() => changeCurrency("EUR")}
                    >
                        EUR
                    </button>
                </DropdownItem>
                <DropdownItem>
                    <button
                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                        onClick={() => changeCurrency("USD")}
                    >
                        USD
                    </button>
                </DropdownItem>
                <DropdownItem>
                    <button
                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                        onClick={() => changeCurrency("GBP")}
                    >
                        GBP
                    </button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
