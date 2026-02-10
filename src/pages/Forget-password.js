import React, { useState } from "react";
import { useRouter } from "next/router";
import { message, Spin } from "antd";
import * as Yup from "yup";
import { authAPI } from "@/Services/api";

/* =======================
   Yup Schema
======================= */
const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});

  /* =======================
     Validate Form
  ======================== */
  const validateForm = async () => {
    try {
      await forgotSchema.validate(formData, { abortEarly: false });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* =======================
     Submit Handler
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const res = await authAPI.forgetPassword(formData);

      message.success("OTP sent to your email");
      console.log(res);

      router.push({
        pathname: "/verify-reset-otp",
        query: {
          userId: res.data.data.userId,
          email: formData.email,
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Failed to send OTP";
      setApiError(errorMsg);
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center py-12 lg:py-26">
        <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {/* Yup Validation Error */}
            {errors.email && (
              <p className="text-sm text-red-600 !mb-0">{errors.email}</p>
            )}

            {/* API Error */}
            {apiError && (
              <p className="text-sm text-red-600 !mb-0">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#10E9DD] hover:bg-[#00c9c0] py-2 rounded !mt-2"
            >
              {isLoading ? <Spin size="small" /> : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
