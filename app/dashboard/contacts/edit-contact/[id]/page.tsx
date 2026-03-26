"use client";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AppShell from "@/components/layout/AppShell";
import { useFormik } from "formik";
import { getContactWithID, updateContact } from "@/lib/firebase/firestore";
import { IContact } from "@/types";

const scheme = yup.object().shape({
  firstName: yup.string().required("Required!"),
  lastName: yup.string().required("Required!"),
  email: yup.string().required("Required!"),
  phoneNumber: yup.string().required("Required!"),
});

function EditContactPage({ params }: { params: { id: string } }) {
  const contactID = params?.id;
  const router = useRouter();
  const [contact, setContact] = useState<IContact | undefined>();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => {
    setLoading(true);
    try {
      await updateContact(contactID, data);
      router.push("/dashboard/contacts");
    } catch (error) {
      alert("Error creating contact");
    }
    setLoading(false);
  };
  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
      validationSchema: scheme,
      onSubmit,
    });

  const getContact = useCallback(async () => {
    const returnedContact = await getContactWithID(contactID!);
    if (returnedContact) {
      setFieldValue("email", returnedContact.email);
      setFieldValue("firstName", returnedContact.firstName);
      setFieldValue("lastName", returnedContact.lastName);
      setFieldValue("phoneNumber", returnedContact.phoneNumber);
      setContact(returnedContact);
    }
  }, [contactID]);
  useEffect(() => {
    getContact();
  }, []);

  return (
    <AppShell>
      {() =>
        !contact?.userId ? (
          <div className="flex justify-center items-center">Loading...</div>
        ) : contact?.userId !== auth.currentUser?.uid ? (
          <div className="flex justify-center items-center">
            This resource is not allowed.
          </div>
        ) : (
          <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-8">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-black">
                    Edit Contact
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
                    errorMessage={touched.firstName ? errors.firstName : ""}
                    onChange={handleChange("firstName")}
                    required
                    placeholder="Jane"
                  />
                  <Input
                    label="Last Name"
                    value={values.lastName}
                    name="lastName"
                    errorMessage={touched.lastName ? errors.lastName : ""}
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
                    errorMessage={touched.email ? errors.email : ""}
                    onChange={handleChange("email")}
                    required
                    placeholder="eg. janedoe@gmail.com"
                  />

                  <Input
                    label="Phone number"
                    value={values.phoneNumber}
                    name="phoneNumber"
                    errorMessage={touched.phoneNumber ? errors.phoneNumber : ""}
                    onChange={handleChange("phoneNumber")}
                    required
                    placeholder="eg. +234 8122 510 760"
                  />
                </div>

                <Button isLoading={loading} title="Submit" />
              </div>
            </form>
          </div>
        )
      }
    </AppShell>
  );
}

export default EditContactPage;
