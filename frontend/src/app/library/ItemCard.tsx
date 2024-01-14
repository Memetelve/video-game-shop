import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ItemDisplay({ item }: { item: Item }) {
    if (item.description.length > 100) {
        item.description = item.description.slice(0, 100) + "...";
    }

    return (
        <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4 ">
            <Link href="#">
                <div className="relative pb-48 overflow-hidden ">
                    <Image
                        className="absolute inset-0 h-full w-full object-cover"
                        src={item.image}
                        alt=""
                        layout="fill"
                    />
                </div>
                <div className="p-4 bg-slate-300">
                    <h2 className="mt-2 mb-2  font-bold">{item.name}</h2>
                    <p className="text-sm h-16">{item.description}</p>
                    <div className="mt-3 flex items-center">
                        <span className="font-bold text-xl">Owned</span>
                        &nbsp;
                    </div>
                </div>

                <Button
                    className="w-full bg-slate-300"
                    variant="contained"
                    onClick={() => {
                        const blob = new Blob(["Dummy content"], {
                            type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${item.name
                            .toLowerCase()
                            .replace(/\s/g, "_")}.exe`;
                        link.click();
                        URL.revokeObjectURL(url);
                    }}
                >
                    Download
                </Button>
            </Link>
        </div>
    );
}
