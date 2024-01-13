"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/components/Context";
import ItemList from "@/components/ItemList";

export default function Main() {
    const context = useAppContext();
    const router = useRouter();

    if (!context.user || !context.user.id) {
        router.push("/login");
    }

    return (
        <div className="bg-neutral-900 min-h-max">
            <div className="container mx-auto p-20">
                <ItemList />
            </div>
        </div>
    );
}
