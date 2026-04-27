"use client";
import { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize and render reCAPTCHA on mount
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            window.recaptchaVerifier?.clear();
            window.recaptchaVerifier = null;
          },
        },
      );

      window.recaptchaVerifier.render().catch((err) => {
        console.error("reCAPTCHA render error:", err);
        window.recaptchaVerifier?.clear();
        window.recaptchaVerifier = null;
      });
    }

    return () => {
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
    };
  }, []);

  const sendOTP = async () => {
    if (!phone) return alert("Enter phone number with country code");

    try {
      setLoading(true);

      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }

      // Wait for render to complete before proceeding
      await window.recaptchaVerifier.render();

      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier,
      );
      setConfirmationResult(confirmation);
      alert("OTP sent!");
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;

      if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number. Use E.164 format: +2348012345678");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many attempts. Try again later.");
      } else if (error.code === "auth/invalid-app-credential") {
        alert("reCAPTCHA failed. Please refresh and try again.");
      } else {
        alert(`Failed to send OTP: ${error.message}`);
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
      console.log("User:", result.user);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      alert(
        error.code === "auth/invalid-verification-code"
          ? "Wrong OTP, try again."
          : "Verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      {!confirmationResult ? (
        <>
          <input
            type="tel"
            placeholder="+2348012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded"
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
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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
      {/* Must stay in the DOM at all times */}
      <div id="recaptcha-container" />
    </div>
  );
}
