import React, { useEffect, useRef, useState } from "react";
import { Spin, message } from "antd";
import { useRouter } from "next/router";
import { authAPI } from "@/Services/api";

export default function VerifyForgotOtp() {
  const router = useRouter();

  const userId = router.query.userId;
  const email = router.query.email;

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef([]);

  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  if (!userId || !email) {
    return (
      <p className="text-red-500 text-center mt-10">
        Invalid request. Missing userId or email.
      </p>
    );
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.verifyForgotOtp({
        userId,
        otp,
      });

      message.success("OTP verified successfully");
      router.push(`/reset-password?userId=${userId}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
      message.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 lg:py-26 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Verify your email
            </h2>

            <p className="text-center text-gray-600 mb-1">
              Enter the OTP sent to
            </p>
            <p className="text-center text-gray-900 font-medium mb-8">
              {email}
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter OTP
                </label>

                <div className="flex gap-2 justify-center">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength={1}
                      disabled={isLoading}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#10E9DD] transition
                        ${error ? "border-red-500" : "border-gray-300"}
                        ${digit ? "border-blue-500" : ""}`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="!mt-6 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpDigits.some((d) => !d)}
                className="w-full bg-[#10E9DD] disabled:bg-[#00c9c0]
                  text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Spin size="small" />

                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push("/Login")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
