import React, { useState } from "react";
import constants from "@/../config.json";
import { log } from "console";

export default function DataExport() {
    const onSubmit = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // fetch and create a file with the response
        e.preventDefault();
        try {
            const res = await fetch(
                `${constants.API_DOMAIN}/api/v1/admin/database-file`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "sessionToken"
                        )}`,
                    },
                }
            );
            if (!res.ok) {
                return res.json().then((err) => {
                    throw new Error(err.detail);
                });
            }

            const data = await res.json();

            console.log(data.data);

            const blob = new Blob([data.data.toString()], {
                type: "text/plain;charset=utf-8",
            });
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = data.filename; // Set the desired filename with the .txt extension
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            console.log(res);
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    };

    return (
        <div className="mt-12  rounded-md flex flex-row justify-center">
            <button className="p-6 bg-sky-800" onClick={onSubmit}>
                Get DB file
            </button>
        </div>
    );
}
