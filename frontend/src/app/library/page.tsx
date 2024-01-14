"use client";

import React, { useEffect, useState } from "react";
import constants from "@/../config.json";
import Image from "next/image";
import { useAppContext } from "@/components/Context";

import ItemList from "./ItemList";

export default function Library() {
    const context = useAppContext();

    return (
        <div className="bg-neutral-900 min-h-max">
            <div className="container mx-auto p-20">
                <h1 className="text-center text-sky-300 logo-font text-6xl font-extrabold">
                    Library
                </h1>

                <ItemList />
            </div>
        </div>
    );
}
