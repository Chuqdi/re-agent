"use client";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { changePassword } from "@/lib/firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

export const scheme = yup.object().shape({
  current_password: yup
    .string()
    .required("Password is required"),
  new_password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    )
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf(
      [yup.ref("new_password")],
      "Password Confirmation and Password does not match",
    )
    .required("Password Confirmation is required"),
});

function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (
    data: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    },
    actions: any,
  ) => {
    const { confirm_password, current_password, new_password } = data;
    try {
      setLoading(true);
      await changePassword(current_password, new_password, confirm_password);
      actions.resetForm();
      alert("Password updated successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const { values, errors, handleChange, handleSubmit,  } = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
      current_password: "",
    },
    validationSchema: scheme,
    onSubmit,
  });

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Setting
              </h1>
              <p className="mt-1 text-xs text-gray-500">Reset Pasword</p>
            </div>
          </header>

          <div className="flex items-start gap-8">
            <form
              onSubmit={handleSubmit}
              className="card-elevated p-6 flex flex-col gap-8 w-full"
            >
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Reset Password
              </h1>
              <div className="flex flex-col gap-4">
                <Input
                  label="Current Password"
                  placeholder="Current Password"
                  name="current_password"
                  errorMessage={errors?.current_password}
                  value={values.current_password}
                  onChange={handleChange("current_password")}
                  isPassword
                />
                <Input
                  label="New Password"
                  placeholder="New Password"
                  errorMessage={errors?.new_password}
                  value={values.new_password}
                  onChange={handleChange("new_password")}
                  isPassword
                />
                <Input
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  errorMessage={errors?.confirm_password}
                  value={values.confirm_password}
                  onChange={handleChange("confirm_password")}
                  isPassword
                />
                <Button
                  isLoading={loading}
                  title="Reset Password"
                  type="submit"
                />
              </div>
            </form>
            <form className="w-full"></form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default SettingsPage;
