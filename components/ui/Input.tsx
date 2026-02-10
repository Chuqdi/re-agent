import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

type props = {
  errorMessage?: string;
  label?: string;
  isPassword?: boolean;
} & React.ComponentProps<"input">;

function Input({ label, isPassword, errorMessage, ...rest }: props) {
  const [focused, setFocused] = useState(false);
  const [inputType, setInputType] = useState(
    isPassword ? "password" : rest?.type,
  );
  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...rest}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        type={rest?.type ?? inputType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {!!errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setInputType(inputType === "password" ? rest?.type : "password")
          }
          className={clsx(`absolute right-2`, {
            "top-[40%]": focused,
            "top-[48%]": !focused,
          })}
        >
          {inputType !== "password" ? (
            <Icon icon="ri:eye-off-fill" className="w-6 h-6" color="#000" />
          ) : (
            <Icon color="#000" icon="lucide:eye" className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
}

export default Input;
