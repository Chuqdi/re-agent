"use client";

import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import OtpInput from "../ui/OTPInput";
import PhoneInput from "../ui/PhoneInput";

export default function PhoneAuth({
  confirmationResult,
  setConfirmationResult,
}: {
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: Dispatch<SetStateAction<ConfirmationResult | null>>;
}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize reCAPTCHA once on mount
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" },
        );
        recaptchaVerifierRef.current.render();
      } catch (err) {
        console.error("reCAPTCHA init error:", err);
      }
    }

    // Cleanup on unmount
    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const sendOTP = async () => {
    if (!phone) {
      alert("Enter phone number in format: +2348012345678");
      return;
    }

    try {
      setLoading(true);

      if (!recaptchaVerifierRef.current) {
        throw new Error("reCAPTCHA not ready. Refresh page.");
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifierRef.current,
      );

      setConfirmationResult(confirmation);
      alert("OTP sent!");
    } catch (error: any) {
      console.error("Send OTP Error:", error);

      // Reset verifier on error so it can be recreated fresh
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;

      if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number. Use E.164 format: +2348012345678");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many attempts. Try again later.");
      } else {
        alert(error.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) return;

    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      if (error.code === "auth/invalid-verification-code") {
        alert("Wrong OTP, try again.");
      } else {
        alert("Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      {!confirmationResult ? (
        <>
          <PhoneInput
            label="Phone number"
            defaultCountryCode="NG"
            onChange={setPhone}
          />

          <button
            onClick={sendOTP}
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <OtpInput
            value={otp}
            onChange={(value) => setOtp(value)}
            className="border p-2 rounded"
          />

          <button
            onClick={verifyOTP}
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* Must stay mounted for reCAPTCHA */}
      <div id="recaptcha-container" />
    </div>
  );
}
