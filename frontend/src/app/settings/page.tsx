"use client";

import React from "react";
import UserData from "@/components/UserData";
import UserCards from "@/components/UserCards";
import UserDataForm from "@/components/UserDataForm";
import CardForm from "@/components/CardForm";

export default function SettingsPage() {
    return (
        <>
            <div className="grid h-screen bg-neutral-900">
                <div className="bg-neutral-700 rounded-t-md m-24">
                    <h1 className="text-4xl text-white text-center font-bold mt-8 logo-font">
                        Settings
                    </h1>
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            <UserData />
                            <UserDataForm />
                        </div>
                        <div className="flex flex-col flex-1">
                            <UserCards />
                            <CardForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
