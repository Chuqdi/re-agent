"use client";
import AppShell from "@/components/layout/AppShell";
import { createNewContact } from "@/lib/firebase/firestore";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import * as yup from "yup";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const scheme = yup.object().shape({
  firstName: yup.string().required("Required!"),
  lastName: yup.string().required("Required!"),
  email: yup.string().required("Required!"),
  phoneNumber: yup.string().required("Required!"),
});

function AddNewContact() {
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => {
    setLoading(true);
    try {
      const userId = currentUser?.uid;
      if (userId) await createNewContact(data, userId!);
      router.push("/dashboard/contacts");
    } catch (error) {
      alert("Error creating contact");
    }
    setLoading(false);
  };
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
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-8">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-black">
                  Add New Contact
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Specify showing details to add
                </p>
              </div>
              <div className="flex items-center gap-4">
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
              </div>
              <div className="flex items-center gap-4">
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
              </div>

              <Button isLoading={loading} title="Submit" />
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default AddNewContact;
