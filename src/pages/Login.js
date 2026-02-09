"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { message, Spin } from "antd";
import { useAtom } from "jotai";

import * as Yup from "yup";
import { GoogleAuthButton } from "@/auth.component/GoogleAuthButton";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { authAPI } from "@/Services/api";
import { userAtom } from "@/store/atoms";

/* =======================
   Yup Validation Schema
======================= */
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // for reading query params if needed
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef(null);
  const [, setUser] = useAtom(userAtom);

  const { handleGoogleSuccess } = useGoogleAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* =======================
     Yup Validation Handler
  ======================= */
  const validateForm = async () => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  /* =======================
     Input Change Handler
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear only that field error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* =======================
       Google Auth Setup
  ======================= */
  useEffect(() => {
    if (
      window.google &&
      googleButtonRef.current &&
      !googleButtonRef.current.hasRendered
    ) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        size: "large",
        width: "100%",
        border: "none",
      });

      googleButtonRef.current.hasRendered = true;
    }
  }, [handleGoogleSuccess]);

  /* =======================
       Submit Handler
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response.data?.user) {
        setUser(response.data.user);
        message.success("Login successful!");

        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Invalid credentials";

      if (
        err.response?.status === 403 ||
        errorMsg.toLowerCase().includes("verify") ||
        errorMsg.toLowerCase().includes("otp")
      ) {
        const userId = err.response?.data?._id || err.response?.data?.data?._id;

        message.info("Please verify your email with OTP");

        // Use query params instead of state
        router.push({
          pathname: "/verify-reset-otp",
          query: {
            email: formData.email,
            userId,
            isFromLogin: true,
          },
        });
      } else {
        // EMAIL or PASSWORD backend error handling
        const field = errorMsg.toLowerCase().includes("email")
          ? "email"
          : "password";

        setErrors((prev) => ({
          ...prev,
          [field]: errorMsg,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 lg:py-26 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              <Link href="/Signup">
                Don't have an account?{" "}
                <span className="text-[#10E9DD] hover:text-[#00c9c0] font-bold">
                  Create a free account
                </span>
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-base font-medium text-gray-900 ">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-base font-medium text-gray-900">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Link href="/Forget-password">
                <p className="text-red-500 mb-3">ForgetPassword ?</p>
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#10E9DD] hover:bg-[#00c9c0] px-3.5 py-2.5 font-semibold leading-7 "
              >
                {isLoading ? <Spin size="small" /> : "Sign in"}
              </button>
            </form>

            <div className="mt-4">
              <GoogleAuthButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
