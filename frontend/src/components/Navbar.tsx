import React from "react";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="bg-neutral-700 p-4 flex flex-row">
            <Image
                className="rounded-full "
                src="https://cdn.discordapp.com/attachments/1195448866514931783/1195726951445450792/Ih7pAXJ.jpg?ex=65b50a80&is=65a29580&hm=cc8b36b7eb5815c6ec6a39a898ba817371224ca98327f51bc31abf911aaffad3&"
                alt="logo"
                width={60}
                height={60}
            />
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row align-bottom">
                    <a
                        href="/"
                        className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                    >
                        Home
                    </a>
                    <a
                        href="/"
                        className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                    >
                        Library
                    </a>
                    <a
                        href="/"
                        className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
}
