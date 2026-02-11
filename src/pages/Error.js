// src/pages/404.jsx
import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-9xl font-extrabold text-[red] mb-4 animate-pulse">
        404
      </h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        Oops! Page not found
      </p>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#10e9dd] text-white font-semibold rounded-lg hover:bg-[#0bcfc9] transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
