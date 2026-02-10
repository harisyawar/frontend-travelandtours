import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#10E9DD] text-white rounded-lg hover:bg-[#0ed0c5] transition"
      >
        Go Home
      </Link>
    </div>
  );
}
