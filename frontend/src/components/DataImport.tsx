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

            const res = await fetch(
                `${constants.API_DOMAIN}/api/v1/admin/database-file`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "sessionToken"
                        )}`,
                    },
                    body: data,
                }
            );
            // handle the error

            console.log(res);
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    };

    return (
        <div className="">
            <h1 className="text-center text-red-600 font-extrabold">
                Import data from file
            </h1>
            <br />
            <div className="flex flex-row justify-center">
                <form onSubmit={onSubmit}>
                    <label htmlFor="file">File</label>
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files?.[0])}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
