"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { LoginForm } from "../../components/LoginForm";
import { useAppContext } from "@/components/Context";
import constants from "@/../config.json";

export default function Login() {
    const context = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (context.sessionToken) {
            router.push("/");
        } else {
            router.push("/login");
        }
    }, [context.sessionToken, router]);

    return (
        <div className="grid h-screen place-items-center bg-neutral-900">
            <div className="bg-neutral-700 rounded-t-md">
                <div className="max-w-md max-h-72 overflow-hidden rounded-">
                    <Image
                        src="https://cdn.discordapp.com/attachments/1195448866514931783/1195458517876887702/YqRJZso.jpg?ex=65b41081&is=65a19b81&hm=2d7810d1310e3e497fcc28212c9c7d87e32a2c3f2cffbd3d8e4840fa2da3fe58&"
                        alt="shop logo"
                        width={200}
                        height={120}
                        layout="responsive"
                    />
                </div>
                <div className="mt-12 px-8 pb-4">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
