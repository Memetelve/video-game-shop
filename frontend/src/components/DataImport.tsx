import React, { useState } from "react";
import constants from "@/../config.json";

export default function DataImport() {
    const [file, setFile] = useState<File>();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            return;
        }

        try {
            const data = new FormData();
            data.set("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "sessionToken"
                    )}`,
                    accept: "application/json",
                },
                body: data,
            });
            // handle the error
            if (!res.ok) {
                throw new Error(await res.text());
            }
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
            />
            <input type="submit" value="Upload" />
        </form>
    );
}
