import React, { useContext, useEffect, useState } from "react";
import constants from "../../config.json";
import { useAppContext } from "./Context";

interface UserData {
    email: string;
    username: string;
    role: string;
}

export default function UserData() {
    const context = useAppContext();

    const [userData, setUserData] = useState<UserData>({
        email: "",
        username: "",
        role: "",
    });

    useEffect(() => {
        const getUserData = async () => {
            const res = await fetch(`${constants.API_DOMAIN}/auth/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "sessionToken"
                    )}`,
                },
            });
            const data = await res.json();
            console.log(data);

            setUserData(data);
        };

        getUserData();
    }, [context.sessionToken]);

    return (
        <div className="text-white text-center flex-1 mb-12">
            <h1
                className={`text-2xl font-bold ${
                    userData.role === "admin" ? "text-red-500" : ""
                }`}
            >
                User Data
            </h1>
            <p>Email: {userData.email}</p>
            <p>Username: {userData.username}</p>
            <p>Role: {userData.role}</p>
        </div>
    );
}
