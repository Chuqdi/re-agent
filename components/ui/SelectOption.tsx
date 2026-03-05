import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

type props = {
  errorMessage?: string;
  label?: string;
  children: React.ReactNode;
} & React.ComponentProps<"select">;

function SelectOption({ label, children, errorMessage, ...rest }: props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        {...rest}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-[2.5rem]"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </select>

      {!!errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
}

export default SelectOption;
