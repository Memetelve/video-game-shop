"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContextProvider from "../components/Context";
import { usePathname } from "next/navigation";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (
            localStorage.getItem("sessionToken") &&
            (pathname === "/login" || pathname === "/register")
        ) {
            router.push("/");
        } else if (localStorage.getItem("sessionToken")) {
            return;
        } else if (pathname !== "/register") {
            router.push("/login");
        }
    }, [router, pathname]);

    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <ContextProvider>
                    <Navbar />
                    {children}
                </ContextProvider>
            </body>
        </html>
    );
}
