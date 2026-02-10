import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { message, Spin } from "antd";

import * as Yup from "yup";
import { GoogleAuthButton } from "@/auth.component/GoogleAuthButton";
import { authAPI } from "@/Services/api";

const Signup = () => {
  const googleButtonRef = useRef(null);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const signupSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
  });

  const validateForm = async () => {
    try {
      await signupSchema.validate(formData, { abortEarly: false });
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      const response = await authAPI.signup(formData);
      console.log(response);
      if (response.data) {
        const userId = response.data._id || response.data.data?._id;
        message.success("Account created! Please verify your email with OTP.");
        router.push(
          `/verify-otp?email=${formData.email}&userId=${userId}&isFromLogin=false`,
        );
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Signup failed. Please try again.";

      if (errorMsg.includes("verified")) {
        message.info(
          "This email is already registered. Redirecting to login...",
        );
        setTimeout(() => router.push("/login"), 1500);
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.data?._id
      ) {
        router.push(
          `/verify-otp?email=${formData.email}&userId=${err.response.data.data._id}&isFromLogin=false`,
        );
      } else {
        message.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 lg:py-26 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Create account
            </h2>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/Login"
                className="text-[#10E9DD] hover:text-[#00c9c0] font-bold"
              >
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="At least 8 characters"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#10E9DD] hover:bg-[#00c9c0] px-3.5 py-2.5 font-semibold leading-7"
              >
                {isLoading ? (
                  <>
                    <Spin size="small text-white" />
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-4">
              <GoogleAuthButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Disable static generation for pages using useRouter
export async function getServerSideProps() {
  return { props: {} };
}

export default Signup;
