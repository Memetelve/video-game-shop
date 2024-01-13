import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/components/Context";

import constants from "../../config.json";

export function LoginForm() {
    const router = useRouter();
    const context = useAppContext();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("This field is required"),
        password: Yup.string()
            .min(8)
            .matches(
                /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
                "Invalid password format"
            )
            .required("This field is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            // formik.resetForm();

            const newValues = {
                username: values.email,
                password: values.password,
            };

            fetch(`${constants.API_DOMAIN}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newValues),
            })
                .then((res) => res.json())
                .then((res) => {
                    const sessionToken = res.token;
                    localStorage.setItem("sessionToken", sessionToken);

                    fetch(`${constants.API_DOMAIN}/auth/me`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            context.setUser({
                                id: res.id,
                                username: res.username,
                                email: res.email,
                                role: res.role,
                            });

                            router.push("/");
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                    router.push("/");
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    });

    const inputClasses =
        "w-full rounded-md h-8 p-3 focus:outline-none focus:bg-blue-300";
    const labelClasses = "text-md font-bold text-blue-600 pl-1";
    const errorClasses = "text-red-500";

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email" className={labelClasses}>
                Email Address
            </label>
            <br />
            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={inputClasses}
            />
            {formik.touched.email && formik.errors.email ? (
                <div className={errorClasses}>{formik.errors.email}</div>
            ) : (
                <>
                    <br />
                    <br />
                </>
            )}
            <label htmlFor="password" className={labelClasses}>
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={inputClasses}
            />
            {formik.touched.password && formik.errors.password ? (
                <div className={errorClasses}>{formik.errors.password}</div>
            ) : (
                <>
                    <br />
                    <br />
                </>
            )}
            <div className="flex items-center justify-center flex-col">
                <button
                    type="submit"
                    className="mt-6 bg-blue-700 py-4 px-6 font-medium rounded-lg"
                >
                    Login
                </button>
                <div className="mt-4 text-sm text-gray-400">
                    <Link href="/register">New? Register here</Link>
                </div>
            </div>
        </form>
    );
}
