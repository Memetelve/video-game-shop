import React from "react";
import Image from "next/image";
import { useAppContext } from "@/components/Context";
import { useRouter, usePathname } from "next/navigation";
import constants from "../../config.json";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Notifications from "./Notifications";
import CurrencyChanger from "./CurrencyChanger";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@nextui-org/react";

export default function Navbar() {
    const context = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    const myUsernames = ["Memetelve", "Telve", "Telvet"];

    const logout = () => {
        localStorage.removeItem("sessionToken");
        context.setSessionToken("");
        context.setUser({
            id: 0,
            username: "",
            email: "",
            role: "",
        });

        router.push("/login");
    };

    const userAvatar = myUsernames.includes(context.user.username)
        ? "https://cdn.discordapp.com/avatars/288717325765443587/d5999bdcd8bcc8455a11fd1f43e34e95.gif?size=64"
        : `https://api.dicebear.com/7.x/pixel-art/png?seed=${context.user.username}`;

    return (
        <>
            {!context.user.id ? (
                <></>
            ) : (
                <nav className="bg-neutral-700 p-4 ">
                    <div className="flex flex-row justify-between items-center">
                        <Image
                            className="rounded-full "
                            src="https://cdn.discordapp.com/attachments/1195448866514931783/1195726951445450792/Ih7pAXJ.jpg?ex=65b50a80&is=65a29580&hm=cc8b36b7eb5815c6ec6a39a898ba817371224ca98327f51bc31abf911aaffad3&"
                            alt="logo"
                            width={60}
                            height={60}
                        />
                        <div className="flex-row">
                            <Link
                                href="/"
                                className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                            >
                                Home
                            </Link>
                            <Link
                                href="/library"
                                className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                            >
                                Library
                            </Link>
                            <Link
                                href="/"
                                className="text-neutral-100 hover:text-neutral-300 font-semibold px-4 py-2 rounded-md"
                            >
                                Contact
                            </Link>
                        </div>
                        <div className="ml-auto">
                            <CurrencyChanger />
                            <Notifications />
                            <Dropdown>
                                <DropdownTrigger>
                                    <button className="flex-row ml-6">
                                        <div className="bg-sky-950 rounded-lg text-slate-100 py-2 pr-3 flex flex-row items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 inline-block ml-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {context.user.username}
                                            <Image
                                                src={userAvatar}
                                                alt="avatar"
                                                width={30}
                                                height={30}
                                                className="rounded-full ml-2"
                                            />
                                        </div>
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Static Actions"
                                    className="bg-slate-800 text-white rounded-lg p-2"
                                    onAction={(item) => {
                                        if (item === "logout") {
                                            const token =
                                                localStorage.getItem(
                                                    "sessionToken"
                                                );

                                            logout();

                                            fetch(
                                                `${constants.API_DOMAIN}/auth/logout`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                }
                                            )
                                                .then((res) => res.json())
                                                .then((res) => {
                                                    console.log(res);
                                                });
                                        }
                                    }}
                                >
                                    <DropdownItem
                                        key="settings"
                                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                                    >
                                        <Link href="/settings">Settings</Link>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="transactions"
                                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                                    >
                                        <Link href="/transactions">
                                            Transactions
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg text-red-600"
                                    >
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}
