"use client";
import AppShell from "@/components/layout/AppShell";
import { createNewRequest } from "@/lib/firebase/firestore";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import * as yup from "yup";
import { getAddressGeoCoordinates } from "@/lib/utils/geolocation";

const scheme = yup.object({
  property: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  type: yup.string().required("Required"),
  amount: yup
    .number()
    .min(1, "Minimum allowed amount is 1")
    .required("Required"),
  status: yup.string().required("Required"),
});
function AddnewRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const onSubmit = async (data: {
    property: string;
    city: string;
    state: string;
    type: string;
    amount: number;
    status: string;
  }) => {
    setIsLoading(true);
    const { state, city } = data;
    const address = `${city},${state}`;
    let coordinates: { lat: number; lng: number };
    try {
      coordinates = await getAddressGeoCoordinates(address);
    } catch (e) {
      alert("Error getting gelocation");
      return;
    }

    try {
      const userId = currentUser?.uid;
      if (userId) await createNewRequest({ ...data, coordinates }, userId!);
      router.push("/dashboard/requests");
    } catch (error) {
      alert("Error creating requests");
    }
    setIsLoading(false);
  };
  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    validationSchema: scheme,
    onSubmit,
    initialValues: {
      property: "",
      city: "",
      state: "",
      type: "Buy",
      amount: 0,
      status: "Active",
    },
  });

  return (
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-14">
            <div className="space-y-8">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-black">
                  Add New Request
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Specify showing details to add
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-10">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property
                    </label>
                    <input
                      value={values.property}
                      onChange={handleChange("property")}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="eg. 3 Bedroom Terrace. Ikoyi"
                    />
                    {!!errors?.property && touched?.property && (
                      <p className="text-sm text-red-400">{errors?.property}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      value={values.city}
                      onChange={handleChange("city")}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="eg. Rent"
                    />
                    {!!errors?.city && touched?.city && (
                      <p className="text-sm text-red-400">{errors?.city}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={values.state}
                      onChange={handleChange("state")}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500"
                      placeholder="eg. Ohio"
                    />
                    {!!errors?.state && touched?.state && (
                      <p className="text-sm text-red-400">{errors?.state}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={values.type}
                      onChange={handleChange("type")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-[2.5rem]"
                    >
                      <option value="Rent">Rent</option>
                      <option value="Buy">Buy</option>
                    </select>
                    {!!errors?.type && touched?.type && (
                      <p className="text-sm text-red-400">{errors?.type}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={values.amount}
                      onChange={handleChange("amount")}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 "
                      placeholder="eg. 30"
                    />
                    {!!errors?.amount && touched?.amount && (
                      <p className="text-sm text-red-400">{errors?.amount}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={values.status}
                      onChange={handleChange("status")}
                      className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-[2.5rem]"
                    >
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                    {!!errors?.status && touched?.status && (
                      <p className="text-sm text-red-400">{errors?.status}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <button
                onClick={() => router.back()}
                type="button"
                className="w-full bg-white border hover:bg-[#ecececef] text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-black hover:bg-[#000000ef] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Add Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default AddnewRequest;
