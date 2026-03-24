"use client";
import AppShell from "@/components/layout/AppShell";
import AddInvoiceItemSection from "@/components/sections/AddInvoiceItemSection";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import {
  createNewInvoice,
  createNewShowing,
  getAllContacts,
} from "@/lib/firebase/firestore";
import { IContact, IInvoiceItem } from "@/types";
import { useFormik } from "formik";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const scheme = yup.object({
  companyName: yup.string().required("Required"),
  address: yup.string().required("Required"),
  phoneNumber: yup.string().required("Required"),
});

function AddNewInvoice() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<IInvoiceItem[]>([]);
  const [activeInvoiceItem, setActiveInvoiceItem] = useState<IInvoiceItem>();
  const onSubmit = async (data: {
    companyName: string;
    address: string;
    phoneNumber: string;
  }) => {
    if (!invoiceItems?.length) {
      alert("Atleast 1 invoice item is required");
      return;
    }
    setIsLoading(true);
    try {
      createNewInvoice({
        ...data,
        items: invoiceItems,
      });
      router.push("/dashboard/invoices/");
    } catch (error) {
      alert("Error creating requests");
    }
    setIsLoading(false);
  };
  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    validationSchema: scheme,
    onSubmit,
    initialValues: {
      companyName: "",
      address: "",
      phoneNumber: "",
    },
  });

  return (
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <div className="space-y-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Add New Invoice
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Specify invoice details to add
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    label="Company Name"
                    value={values.companyName}
                    onChange={handleChange("companyName")}
                    errorMessage={errors.companyName}
                    required
                    placeholder="e.g Sample Company Plc"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="Address"
                    value={values.address}
                    onChange={handleChange("address")}
                    errorMessage={errors.address}
                    placeholder="eg. 30 Odunjo Way, Surulere, Lagos"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    label="Phone number"
                    value={values.phoneNumber}
                    onChange={handleChange("phoneNumber")}
                    errorMessage={errors.phoneNumber}
                    required
                  />
                </div>
              </div>

              <h1 className="text-lg font-semibold tracking-tight text-black">
                Add Invoice Items
              </h1>

              <div className="flex flex-col gap-4">
                {invoiceItems.map((invoice, index) => (
                  <div
                    className="flex items-center justify-between bg-white px-4 py-2 border border-[#bdbdbd3e] rounded-xl w-full"
                    key={`single_invoice_item_${invoice.id}_${index}`}
                  >
                    <div>
                      <h5 className="text-lg font-bold">{invoice.amount}</h5>
                      <p className="text-base ">{invoice.description}</p>
                    </div>
                    <button
                      onClick={() => setActiveInvoiceItem(invoice)}
                      className="p-2 rounded bg-[#4b4b4b8c]"
                    >
                      <Pencil size={15} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>

              <AddInvoiceItemSection
                setActiveInvoiceItem={setActiveInvoiceItem}
                activeInvoiceItem={activeInvoiceItem}
                setItems={setInvoiceItems}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                title="Cancel"
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              />
              <Button
                isLoading={isLoading}
                onClick={() => handleSubmit()}
                title="Add Invoice"
                type="submit"
              />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default AddNewInvoice;
