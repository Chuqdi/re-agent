import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Pencil, Plus } from "lucide-react";
import { IInvoiceItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import Textarea from "../ui/TextArea";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const scheme = yup.object({
  description: yup.string().required("Required"),
  quantity: yup.string().required("Required"),
  rate: yup.string().required("Required"),
  tax: yup.string().required("Required"),
  amount: yup.string().required("Required"),
});

function AddInvoiceItemSection({
  activeInvoiceItem,
  setItems,
  setActiveInvoiceItem,
  isShowingAddItemsInputs,
  setIsShowingAddItemsInputs,
}: {
  activeInvoiceItem?: IInvoiceItem;
  setItems: React.Dispatch<React.SetStateAction<IInvoiceItem[]>>;
  setIsShowingAddItemsInputs: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingAddItemsInputs: boolean;
  setActiveInvoiceItem: React.Dispatch<
    React.SetStateAction<IInvoiceItem | undefined>
  >;
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
    if (activeInvoiceItem?.id) {
      setItems((its) => {
        return its.map((i) => {
          if (i?.id === activeInvoiceItem?.id) {
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
    } else {
      setItems((its) => [...its, { ...data, id: uuidv4() }]);
    }
    setActiveInvoiceItem(undefined);
    action.resetForm();
    setIsShowingAddItemsInputs(false);
   
  };

  const {
    values,
    handleSubmit,
    handleChange,
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
    if (activeInvoiceItem) {
      resetForm();
      setFieldValue("amount", activeInvoiceItem.amount);
      setFieldValue("description", activeInvoiceItem.description);
      setFieldValue("quantity", activeInvoiceItem.quantity);
      setFieldValue("rate", activeInvoiceItem.rate);
      setFieldValue("tax", activeInvoiceItem.tax);
    }
  }, [activeInvoiceItem]);

  return (
    <form
      className=" space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        isShowingAddItemsInputs
          ? handleSubmit()
          : setIsShowingAddItemsInputs(true);
      }}
    >
      <AnimatePresence>
        {isShowingAddItemsInputs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className=" space-y-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input
                  label="Quantity"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange("quantity")}
                  errorMessage={touched.quantity ? errors.quantity : ""}
                  required
                />
              </div>

              <div className="flex-1">
                <Input
                  label="Rate"
                  type="number"
                  value={values.rate}
                  onChange={handleChange("rate")}
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
                  onChange={handleChange("tax")}
                  errorMessage={touched?.tax ? errors.tax : ""}
                  required
                />
              </div>

              <div className="flex-1">
                <Input
                  label="Amount"
                  value={values.amount}
                  type="number"
                  onChange={handleChange("amount")}
                  errorMessage={touched.amount ? errors.amount : ""}
                  placeholder="eg. 30"
                />
              </div>
            </div>

            <Textarea
              value={values.description}
              onChange={handleChange("description")}
              errorMessage={touched.description ? errors.description : ""}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full justify-center items-end">
        <Button
          variant="secondary"
          title={isShowingAddItemsInputs ? "Add Item" : "Add Invoice Item"}
          className="w-full "
          type="button"
          rightIcon={
          
            <Plus color="#000" size={20} />
          }
        />
      </div>
    </form>
  );
}

export default AddInvoiceItemSection;
