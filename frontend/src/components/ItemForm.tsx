import { useFormik } from "formik";
import React from "react";
import constants from "@/../config.json";
import * as Yup from "yup";

export default function ItemForm() {
    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        price: Yup.number().required("Required"),
        image: Yup.string().required("Required"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: 0,
            image: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const body = {
                name: values.name,
                description: values.description,
                price: values.price,
                image_url: values.image,
            };

            console.log(body);

            fetch(`${constants.API_DOMAIN}/api/v1/admin/items/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "sessionToken"
                    )}`,
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    formik.resetForm();
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
                className="mb-3 ml-2 rounded-md"
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
            />

            {formik.touched.name && formik.errors.name ? (
                <>{formik.errors.name}</>
            ) : null}
            <br />
            <label htmlFor="description">Description</label>
            <input
                className="mb-3 ml-2 rounded-md"
                id="description"
                name="description"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
                <>{formik.errors.description}</>
            ) : null}
            <br />
            <label htmlFor="price">Price</label>
            <input
                className="mb-3 ml-2 rounded-md"
                id="price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price ? (
                <>{formik.errors.price}</>
            ) : null}
            <br />
            <label htmlFor="image">Image</label>
            <input
                className="mb-3 ml-2 rounded-md"
                id="image"
                name="image"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.image}
            />
            {formik.touched.image && formik.errors.image ? (
                <>{formik.errors.image}</>
            ) : null}
            <br />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
            >
                Submit
            </button>
        </form>
    );
}
