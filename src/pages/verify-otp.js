import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { message, Spin } from "antd";

import { userAtom } from "@/store/atoms";
import { authAPI } from "@/Services/api";

const OtpVerification = () => {
  const router = useRouter();
  const [, setUser] = useAtom(userAtom);

  const email = router.query.email;
  const userId = router.query.userId;
  const isFromLogin = router.query.isFromLogin === "true";

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  // Redirect if params missing
  useEffect(() => {
    if (!email || !userId) {
      router.replace("/signup");
    }
  }, [email, userId, router]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await authAPI.verifyOtp({
        userId,
        email,
        otp,
      });

      if (res.data?.user) {
        setUser(res.data.user);
        message.success("Email verified successfully!");
        router.push("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";

      setError(
        msg.toLowerCase().includes("otp")
          ? "OTP expired. Please request a new one."
          : msg,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      const res = await authAPI.resendOtp({ userId, email });
      if (res.data?.success) {
        message.success("OTP sent to your email");
        setOtpDigits(["", "", "", "", "", ""]);
        setResendTimer(60);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setError(msg);
      message.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2">
          Verify your email
        </h2>

        <p className="text-center text-gray-600 mb-1">Enter the OTP sent to</p>
        <p className="text-center font-medium mb-6">{email}</p>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                value={digit}
                maxLength={1}
                disabled={isLoading}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className={`w-12 h-14 text-2xl font-bold text-center border-[#10E9DD] border-2 rounded-lg ${error ? "border-red-500" : "border-gray-300"
                  }`}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || otpDigits.some((d) => !d)}
            className="w-full bg-[#10E9DD] hover:bg-[#00c9c0] py-3 rounded-lg font-semibold flex justify-center gap-2"
          >
            {isLoading ? <Spin size="small" /> : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm">
              Resend OTP in{" "}
              <span className="font-semibold">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="font-semibold text-sm text-blue-600"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <div className="mt-6 border-t pt-4 text-center">
          <button
            onClick={() => router.push(isFromLogin ? "/login" : "/signup")}
            className="text-sm text-gray-600"
          >
            ← Back to {isFromLogin ? "Login" : "Signup"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Disable static generation for pages using useRouter
export async function getServerSideProps() {
  return { props: {} };
}

export default OtpVerification;
