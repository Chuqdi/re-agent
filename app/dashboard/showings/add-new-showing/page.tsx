"use client";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import { createNewShowing, getAllContacts } from "@/lib/firebase/firestore";
import { IContact } from "@/types";
import { getAuth } from "firebase/auth";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const scheme = yup.object({
  address: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  showingTime: yup.string().required("Required"),
  invitee: yup.string().required("Required"),
});

function AddNewShowing() {
  const router = useRouter();
  const [contacts, setContacts] = useState<IContact[]>();
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: {
    address: string;
    city: string;
    state: string;
    showingTime: string;
    invitee: string;
  }) => {
    setIsLoading(true);
    try {
      const requestData = {
        ...data,
        showingTime: new Date(data.showingTime).toISOString(),
        coordinates:{ //mar 31st assign to hezekiah to use geographical data
          lat:6.30,
          lng:4.01
        }
      };
      await createNewShowing(requestData);
      router.push("/dashboard/showings");
    } catch (error) {
      alert("Error creating requests");
    }
    setIsLoading(false);
  };
  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    validationSchema: scheme,
    onSubmit,
    initialValues: {
      address: "",
      city: "",
      state: "",
      showingTime: "",
      invitee: "",
    },
  });

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      getAllContacts(userId).then((r) => {
        setContacts(r);
      });
    }
  }, [auth]);

  return (
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Add New Showing
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Specify showing details to add
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    label="Address"
                    value={values.address}
                    onChange={handleChange("address")}
                    errorMessage={errors.address}
                    required
                    placeholder="eg. 3 Bedroom Terrace. Ikoyi"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="State"
                    value={values.state}
                    onChange={handleChange("state")}
                    errorMessage={errors.state}
                    placeholder="eg. Rent"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="City"
                    value={values.city}
                    onChange={handleChange("city")}
                    errorMessage={errors.city}
                    placeholder="eg. 30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    label="Showing Time"
                    value={values.showingTime}
                    onChange={handleChange("showingTime")}
                    errorMessage={errors.showingTime}
                    required
                    type="date"
                  />
                </div>

                <div className="flex-1">
                  <SelectOption
                    value={values.invitee}
                    onChange={handleChange("invitee")}
                    errorMessage={errors.invitee}
                    required
                    label="Invitee"
                  >
                    <option value="">Select invitee</option>
                    {contacts?.map((contact) => (
                      <option key={contact?.id}>
                        {contact?.firstName} {contact?.lastName}
                      </option>
                    ))}
                  </SelectOption>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                title="Cancel"
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              />
              <Button isLoading={isLoading} title="Add Showing" type="submit" />
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default AddNewShowing;
