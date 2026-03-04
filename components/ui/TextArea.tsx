type props = {
  label?: string;
  errorMessage?: string;
  className?:string;
} & React.ComponentProps<"textarea">;
function Textarea({ label, errorMessage,className, ...rest }: props) {
  return (
    <div className="w-full relative flex flex-col gap-1">
      {label && (
        <label className="label">{label}</label>
      )}
      <textarea
        rows={4}
        className={`bg-[#fff] border-[0.5px] border-[#E5E5E5] resize-none rounded-md p-4 placeholder:text-gray-500 ${className}`}
        {...rest}
      />
      {errorMessage && (
        <p className="text-red-900 text-sm font-inter">{errorMessage}</p>
      )}
    </div>
  );
}

export default Textarea;