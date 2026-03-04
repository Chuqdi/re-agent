import clsx from "clsx";
import React from "react";

type props = {
  isLoading?: boolean;
  title: string;
  variant?: "primary" | "secondary";
  rightIcon?: React.ReactNode;
  className?:string;
} & React.ComponentProps<"button">;

function Button({
  title,
  isLoading,
  rightIcon,
  variant = "primary",
  className,
  ...rest
}: props) {
  return (
    <button
      {...rest}
      type="submit"
      className={clsx(
        "w-full gap-2  hover:bg-[#000000ef] flex items-center justify-center  font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-black text-white": variant === "primary",
          "bg-white text-black hover:bg-[#ecececef]  border border-[#c5c5c582]":
            variant === "secondary",
        },
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : title}
      {rightIcon}
    </button>
  );
}

export default Button;
