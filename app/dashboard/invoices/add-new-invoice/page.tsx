"use client";
import AppShell from "@/components/layout/AppShell";
import AddInvoiceItemSection from "@/components/sections/AddInvoiceItemSection";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createNewInvoice } from "@/lib/firebase/firestore";
import { IInvoiceItem } from "@/types";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import SingleInvoiceItem from "../components/SingleInvoiceItem";
import { getAuth } from "firebase/auth";

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
  const [isShowingAddItemsInputs, setIsShowingAddItemsInputs] = useState(false);
  const auth = getAuth();

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
      const userId = auth.currentUser?.uid;
      if (userId) {
        createNewInvoice(userId, {
          ...data,
          items: invoiceItems,
        });
        router.push("/dashboard/invoices/");
      }
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

              <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold tracking-tight text-black">
                  Invoice Items
                </h1>
                {!!invoiceItems?.length && (
                  <div className="flex flex-col gap-4 mb-6">
                    {invoiceItems.map((invoiceItem, index) => (
                      <SingleInvoiceItem
                        key={`single_invoice_item_${invoiceItem.id}_${index}`}
                        onDeleteInvoice={() => {
                          setInvoiceItems((items) =>
                            items?.filter((i) => i?.id !== invoiceItem.id),
                          );
                        }}
                        invoiceItem={invoiceItem}
                        setItems={setInvoiceItems}
                        updateInvoiceItem={(item: IInvoiceItem) => {
                          setInvoiceItems((items) => {
                            return items.map((i) => {
                              if (i.id === invoiceItem?.id) return item;
                              else return i;
                            });
                          });
                        }}
                      />
                    ))}
                  </div>
                )}

                <AddInvoiceItemSection
                  setActiveInvoiceItem={setActiveInvoiceItem}
                  isShowingAddItemsInputs={isShowingAddItemsInputs}
                  setIsShowingAddItemsInputs={setIsShowingAddItemsInputs}
                  activeInvoiceItem={activeInvoiceItem}
                  setItems={setInvoiceItems}
                />
              </div>
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
