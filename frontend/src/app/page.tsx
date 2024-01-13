"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/components/Context";
import ItemList from "@/components/ItemList";

export default function Main() {
    const context = useAppContext();
    const router = useRouter();

    return <ItemList />;
}
