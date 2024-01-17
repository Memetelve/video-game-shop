"use client";

import React from "react";
import UserData from "@/components/UserData";
import UserCards from "@/components/UserCards";
import UserDataForm from "@/components/UserDataForm";
import CardForm from "@/components/CardForm";
import { useAppContext } from "@/components/Context";
import DataImport from "@/components/DataImport";
import ItemForm from "@/components/ItemForm";

export default function SettingsPage() {
    const context = useAppContext();

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
                    {context.user.role === "admin" ? (
                        <div className="flex flex-row">
                            <div className="flex flex-col flex-1">
                                <DataImport />
                            </div>
                            <div className="flex flex-col flex-1">
                                <ItemForm />
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}
