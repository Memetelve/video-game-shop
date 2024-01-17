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
                item: {
                    name: values.name,
                    description: values.description,
                    price: values.price,
                    image_url: values.image,
                },
            };
            fetch(`${constants.API_DOMAIN}/api/v1/admin/items/add`, {
                method: "POST",
                headers: {
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
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
                <div>{formik.errors.name}</div>
            ) : null}
            <label htmlFor="description">Description</label>
            <input
                id="description"
                name="description"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
                <div>{formik.errors.description}</div>
            ) : null}
            <label htmlFor="price">Price</label>
            <input
                id="price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price ? (
                <div>{formik.errors.price}</div>
            ) : null}
            <label htmlFor="image">Image</label>
            <input
                id="image"
                name="image"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.image}
            />
            {formik.touched.image && formik.errors.image ? (
                <div>{formik.errors.image}</div>
            ) : null}
            <button type="submit">Submit</button>
        </form>
    );
}
