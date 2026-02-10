"use client";

import { useCallback } from "react";
import { useRouter } from "next/router"; // ✅ Next.js router
import { useAtom } from "jotai";
import { message } from "antd";
import { userAtom } from "../store/atoms";
import { authAPI } from "@/Services/api";

export const useGoogleAuth = () => {
  const router = useRouter(); // ✅ Next.js router
  const [, setUser] = useAtom(userAtom);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      try {
        if (!credentialResponse.credential) {
          message.error("Failed to get Google token");
          return;
        }

        // Extract user info from Google JWT token
        const token = credentialResponse.credential;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        const userData = JSON.parse(jsonPayload);

        // Send token to backend for verification and user creation/login
        const response = await authAPI.googleLogin({
          name: userData.name,
          email: userData.email,
          googleId: userData.sub,
          picture: userData.picture,
          tokenId: token,
        });

        if (response.data?.user) {
          setUser(response.data.user);

          message.success("Google login successful!");

          const redirectPath =
            localStorage.getItem("redirectAfterLogin") || "/";

          localStorage.removeItem("redirectAfterLogin");

          router.push(redirectPath); // ✅ Next.js navigation
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Google login failed";

        if (err.response?.status === 400 || err.response?.status === 403) {
          // User exists but not verified, need OTP
          const userId =
            err.response?.data?._id || err.response?.data?.user?._id;
          const email =
            err.response?.data?.email || err.response?.data?.user?.email;

          if (userId && email) {
            message.info("Please verify your email with OTP");
            router.push("/verify-otp"); // ✅ Next.js navigation
            return;
          }
        }

        message.error(errorMsg);
        console.error("Google auth error:", err);
      }
    },
    [router, setUser],
  );

  const handleGoogleError = useCallback(() => {
    message.error("Google login failed. Please try again.");
    console.error("Google login failed");
  }, []);

  return { handleGoogleSuccess, handleGoogleError };
};
