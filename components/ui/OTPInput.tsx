import { useRef, useState, useEffect } from "react";
import clsx from "clsx";

type Props = {
  length?: number;
  label?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

function OtpInput({
  length = 6,
  label,
  errorMessage,
  value = "",
  onChange,
  className,
  disabled,
}: Props) {
  const [otp, setOtp] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] || "")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Sync internal state if value prop changes externally
  useEffect(() => {
    setOtp(Array.from({ length }, (_, i) => value[i] || ""));
  }, [value, length]);

  const updateOtp = (newOtp: string[]) => {
    setOtp(newOtp);
    onChange?.(newOtp.join(""));
  };

  const handleChange = (index: number, char: string) => {
    // Only allow single digit
    const digit = char.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    updateOtp(newOtp);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        updateOtp(newOtp);
      } else if (index > 0) {
        // Move to previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        updateOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    const newOtp = Array.from({ length }, (_, i) => pasted[i] || "");
    updateOtp(newOtp);

    // Focus the next empty input or last input
    const nextEmpty = newOtp.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? length - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={otp[index] || ""}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={clsx(
              "w-full h-12 text-center text-lg font-semibold",
              "border rounded-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "border-gray-300",
              {
                "border-red-400 focus:ring-red-400": errorMessage,
                "bg-gray-100 cursor-not-allowed opacity-60": disabled,
                "bg-white": !disabled,
              },
              className
            )}
          />
        ))}
      </div>

      {!!errorMessage && (
        <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default OtpInput;