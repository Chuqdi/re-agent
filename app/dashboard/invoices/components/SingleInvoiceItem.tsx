
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import {  X } from "lucide-react";
import { IInvoiceItem } from "@/types";
import { useEffect } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

const scheme = yup.object({
  description: yup.string().required("Required"),
  quantity: yup.string().required("Required"),
  rate: yup.string().required("Required"),
  tax: yup.string().required("Required"),
  amount: yup.string().required("Required"),
});

function SingleInvoiceItem({
  invoiceItem,
  onDeleteInvoice,
  updateInvoiceItem,
  setItems,
}: {
  invoiceItem: IInvoiceItem;
  updateInvoiceItem: (v: IInvoiceItem) => void;
  onDeleteInvoice: () => void;
  setItems: React.Dispatch<React.SetStateAction<IInvoiceItem[]>>;
}) {
  const onSubmit = (
    data: {
      description: string;
      quantity: string;
      rate: string;
      tax: string;
      amount: string;
    },
    action: FormikHelpers<{
      description: string;
      quantity: string;
      rate: string;
      tax: string;
      amount: string;
    }>,
  ) => {
    setItems((its) => {
      return its.map((i) => {
        if (i?.id === invoiceItem?.id) {
          return {
            ...i,
            ...data,
          };
        } else {
          return {
            ...i,
          };
        }
      });
    });
    action.resetForm();
  };

  const {
    values,
    handleSubmit,
    setFieldValue,
    resetForm,
    errors,
    touched,
  } = useFormik({
    validationSchema: scheme,
    onSubmit,
    initialValues: {
      description: "",
      quantity: "",
      rate: "",
      tax: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (invoiceItem) {
      resetForm();
      setFieldValue("amount", invoiceItem.amount);
      setFieldValue("description", invoiceItem.description);
      setFieldValue("quantity", invoiceItem.quantity);
      setFieldValue("rate", invoiceItem.rate);
      setFieldValue("tax", invoiceItem.tax);
    }
  }, [invoiceItem]);

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        handleSubmit();
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Input
            label="Quantity"
            type="number"
            value={values.quantity}
            onChange={(e) => {
              setFieldValue("quantity", e.target.value);
              updateInvoiceItem({
                ...invoiceItem,
                [e.target.name]: e.target.value,
              });
            }}
            name="quantity"
            errorMessage={touched.quantity ? errors.quantity : ""}
            required
          />
        </div>

        <div className="flex-1">
          <Input
            label="Rate"
            type="number"
            name="rate"
            value={values.rate}
            onChange={(e) => {
              setFieldValue("rate", e.target.value);
              updateInvoiceItem({
                ...invoiceItem,
                [e.target.name]: e.target.value,
              });
            }}
            errorMessage={touched?.rate ? errors.rate : ""}
            placeholder="eg. 30"
          />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Input
            label="Tax"
            value={values.tax}
            type="number"
            onChange={(e) => {
              setFieldValue("tax", e.target.value);
              updateInvoiceItem({
                ...invoiceItem,
                [e.target.name]: e.target.value,
              });
            }}
            name="tax"
            errorMessage={touched?.tax ? errors.tax : ""}
            required
          />
        </div>

        <div className="flex-1">
          <Input
            label="Amount"
            value={values.amount}
            type="number"
            name="amount"
            onChange={(e) => {
              setFieldValue("amount", e.target.value);
              updateInvoiceItem({
                ...invoiceItem,
                [e.target.name]: e.target.value,
              });
            }}
            errorMessage={touched.amount ? errors.amount : ""}
            placeholder="eg. 30"
          />
        </div>
      </div>

      <Textarea
        value={values.description}
        onChange={(e) => {
          setFieldValue("description", e.target.value);
          updateInvoiceItem({
            ...invoiceItem,
            [e.target.name]: e.target.value,
          });
        }}
        name="description"
        errorMessage={touched.description ? errors.description : ""}
      />

      <div className="flex w-full gap-4 justify-center items-end">
        <Button
          variant="primary"
          title={"Delete"}
          className="w-full md:w-[10%]"
          type="button"
          onClick={onDeleteInvoice}
          rightIcon={<X size={18} color="#FFF" />}
        />
        {/* <Button
          variant="secondary"
          title={"Edit"}
          className="w-full md:w-[10%]"
          type="button"
          rightIcon={<Pencil size={18} color="#000" />}
        /> */}
      </div>
    </form>
  );
}

export default SingleInvoiceItem;
