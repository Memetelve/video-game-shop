import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import constants from "../../config.json";

export default function UserDataForm() {
    const [reload, setReload] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address"),
        username: Yup.string().min(3).max(20),
        password: Yup.string()
            .min(8)
            .matches(
                /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
                "Invalid password format"
            ),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
        },
        onSubmit: (values) => {
            const body: any = {};

            if (values.email) {
                body.email = values.email;
            }
            if (values.username) {
                body.username = values.username;
            }
            if (values.password) {
                body.password = values.password;
            }

            console.log(body);

            fetch(`${constants.API_DOMAIN}/api/v1/user/update`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "sessionToken"
                    )}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                });
        },
    });

    return (
        <div className="text-white text-center">
            <h1 className="text-2xl font-bold">User Data Form</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    className="text-black"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <br />
                <br />
                <input
                    className="text-black"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <br />
                <br />
                <input
                    className="text-black"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <br />
                <br />
                <button type="submit" className="bg-blue-500 rounded-md p-2">
                    Submit
                </button>
            </form>
        </div>
    );
}
