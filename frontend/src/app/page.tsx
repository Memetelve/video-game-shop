"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/components/Context";
import ItemList from "@/components/ItemList";

export default function Main() {
    const context = useAppContext();
    const router = useRouter();

    return (
        <div className="bg-neutral-900 min-h-max">
            <div className="container mx-auto p-20">
                <ItemList />
            </div>
        </div>
    );
}
