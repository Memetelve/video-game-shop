import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import constants from "../../config.json";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { TextareaAutosize } from "@mui/material";

export default function ReviewForm({
    itemId,
    refresh,
}: {
    itemId: number;
    refresh: () => void;
}) {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            stars: 0,
            text: "",
        },
        validationSchema: Yup.object({
            stars: Yup.number()
                .min(0)
                .max(5)
                .required("This field is required"),
            text: Yup.string().required("This field is required"),
        }),
        onSubmit: (values) => {
            const sessionToken = localStorage.getItem("sessionToken") || "";

            const body = {
                item: {
                    id: itemId,
                },
                comment: {
                    stars: values.stars,
                    text: values.text,
                },
            };

            fetch(`${constants.API_DOMAIN}/api/v1/items/add-comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(body),
            })
                .then((res) => {
                    res.json();
                    refresh();
                })
                .then((res) => {
                    console.log(res);
                });
        },
    });

    return (
        <div className="flex flex-col">
            <h2 className="text-3xl text-slate-300 font-bold mb-2">Add your</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="">
                    <Typography component="legend" className="text-slate-200">
                        Rating
                    </Typography>
                    <Rating
                        name="half-rating"
                        defaultValue={2.5}
                        precision={0.5}
                        onChange={(event, newValue) => {
                            formik.setFieldValue("stars", newValue);
                        }}
                    />
                    {formik.errors.stars && formik.touched.stars && (
                        <div className="text-red-500 text-sm">
                            {formik.errors.stars}
                        </div>
                    )}
                </div>
                <br />
                <div className="flex flex-col text-white">
                    <TextField
                        className="bg-blue-900 rounded-md p-2"
                        inputProps={{
                            style: { color: "white", border: "none" },
                        }}
                        id="outlined-multiline-static"
                        multiline
                        rows={4}
                        defaultValue={formik.values.text}
                        onChange={(event) =>
                            formik.setFieldValue("text", event.target.value)
                        }
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    {formik.errors.text && formik.touched.text && (
                        <div className="text-red-500 text-sm">
                            {formik.errors.text}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-gray-600 text-white rounded-md px-3 py-2 mt-1 mb-5 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
