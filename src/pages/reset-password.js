import React, { useState } from "react";
import { useRouter } from "next/router";
import { Spin, message } from "antd";
import { authAPI } from "@/Services/api";

import * as Yup from "yup";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export default function ResetPassword() {
  const router = useRouter();

  const userId = router.query.userId;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!userId) {
    return (
      <p className="text-center text-red-500 mt-10">
        Invalid or expired reset request
      </p>
    );
  }

  const validateForm = async () => {
    try {
      await resetPasswordSchema.validate(formData, { abortEarly: false });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await authAPI.resetPassword({
        userId,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Navigate after message shows
      message.success({
        content: "Password reset successfully",
        duration: 1.5, // seconds
        onClose: () => {
          router.push("/Login");
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Reset failed";
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
            <h2 className="text-center text-2xl font-bold text-black">
              Reset your password
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Enter a new password for your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              {/* Password */}
              <div>
                <label className="text-base font-medium text-gray-900">
                  New Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-base font-medium text-gray-900">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#10E9DD] hover:text-[#00c9c0] px-3.5 py-2.5 font-semibold"
              >
                {isLoading ? <Spin size="small" /> : "Reset Password"}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/Login")}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
