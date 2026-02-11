import { useEffect, useState } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { FcGoogle } from "react-icons/fc"; // Google icon

export const GoogleAuthButton = () => {
  const { handleGoogleSuccess } = useGoogleAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google script loaded");
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSuccess,
        });
        setIsReady(true);
      };
      document.body.appendChild(script);
    } else if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });
      setIsReady(true);
    }
  }, [handleGoogleSuccess]);

  const handleGoogleClick = () => {
    if (isReady && window.google) {
      window.google.accounts.id.prompt(); // Show Google Sign-In popup
    } else {
      console.log("Google API not ready yet");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="inline-flex w-full items-center justify-center rounded-md border border-gray-400 px-3.5 py-2.5 font-semibold leading-7 "
    >
      <FcGoogle className="w-6 h-6" /> {/* Google icon */}
      <span className="text-sm font-medium text-gray-700">
        Sign up with Google
      </span>
    </button>
  );
};
