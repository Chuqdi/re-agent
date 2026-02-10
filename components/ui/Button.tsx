import React from "react";

type props = {
  isLoading?: boolean;
  title:string;
} & React.ComponentProps<"button">;

function Button({ title, isLoading, ...rest }: props) {
  return (
    <button
      {...rest}
      type="submit"
      className="w-full bg-black hover:bg-[#000000ef] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : title }
    </button>
  );
}

export default Button;
