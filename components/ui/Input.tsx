import { useState } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";

type Props = {
  errorMessage?: string;
  label?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  className?:string;
} & React.ComponentProps<"input">;

function Input({
  label,
  isPassword,
  errorMessage,
  leftIcon,
  id,
  className,
  ...rest
}: Props) {
  const [inputType, setInputType] = useState(
    isPassword ? "password" : rest.type || "text",
  );

  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          {...rest}
          id={inputId}
          type={inputType}
          className={clsx(
            "w-full py-2 border rounded-md shadow-sm",
            "focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            "border-gray-300",
            {
              "pl-12": leftIcon,
              "pl-3": !leftIcon,
              "pr-12": isPassword,
              "border-red-400": errorMessage,
            },
            className
          )}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={
              inputType === "password" ? "Show password" : "Hide password"
            }
            onClick={() =>
              setInputType((prev) =>
                prev === "password" ? "text" : "password",
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {inputType === "password" ? (
              <Icon icon="lucide:eye" className="w-6 h-6" color="#000" />
            ) : (
              <Icon icon="ri:eye-off-fill" className="w-6 h-6" color="#000" />
            )}
          </button>
        )}
      </div>

      {!!errorMessage && (
        <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default Input;
