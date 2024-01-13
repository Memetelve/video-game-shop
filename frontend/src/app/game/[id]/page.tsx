"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ItemDisplay from "@/components/ItemDisplay";
import ItemReviews from "@/components/ItemReviews";
import ReviewForm from "@/components/ReviewForm";

export default function Item() {
    const router = useRouter();
    const pathname = usePathname();
    const itemId = Number(pathname.split("/")[2]);

    const [refreshState, setRefresh] = useState(false);

    const refresh = () => {
        setRefresh(!refreshState);
    };

    return (
        <div className="bg-neutral-900 min-h-max">
            <div className="container mx-auto p-20">
                <ItemDisplay itemId={itemId} />
                <div className="flex mt-20">
                    <ItemReviews itemId={itemId} refresh={refresh} />
                    <ReviewForm itemId={itemId} refresh={refresh} />
                </div>
            </div>
        </div>
    );
}
