"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import * as yup from "yup";
import { useFormik } from "formik";

export const scheme = yup.object().shape({
  firstName: yup.string().required("Required!"),
  lastName: yup.string().required("Required!"),
  email: yup.string().required("Required!"),
  phoneNumber: yup.string().required("Required!"),
});
export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => {};

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: scheme,
    onSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Send us a message, anytime.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="First Name"
            value={values.firstName}
            name="firstName"
            errorMessage={errors.firstName}
            onChange={handleChange("firstName")}
            required
            placeholder="Jane"
          />
          <Input
            label="Last Name"
            value={values.lastName}
            name="lastName"
            errorMessage={errors.lastName}
            onChange={handleChange("lastName")}
            required
            placeholder="Doe"
          />
          <Input
            label="Email"
            value={values.email}
            name="email"
            errorMessage={errors.email}
            onChange={handleChange("email")}
            required
            placeholder="eg. janedoe@gmail.com"
          />

          <Input
            label="Phone number"
            value={values.phoneNumber}
            name="phoneNumber"
            errorMessage={errors.phoneNumber}
            onChange={handleChange("phoneNumber")}
            required
            placeholder="eg. +234 8122 510 760"
          />

          <Button isLoading={loading} title="Send Message" />
        </form>
      </div>
    </div>
  );
}
