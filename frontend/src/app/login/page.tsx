"use client";

import React from "react";
import Image from "next/image";

import { LoginForm } from "../../components/LoginForm";

export default function Login() {
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
