"use client"
import PhoneAuth from "@/components/sections/PhoneAuth";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function PhoneNumberAuthPage() {
    const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <button onClick={()=>router.back()} className="w-8 h-8 rounded-md bg-gray-200 flex justify-center items-center">
          <ArrowLeft size={16} />
        </button>
          <h1 className="text-3xl font-bold text-center  text-gray-800">
            Get started
          </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your phone number to get started.
        </p>

        <PhoneAuth />
      </div>
    </div>
  );
}

export default PhoneNumberAuthPage;
