/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["northpointtravel.s3.eu-north-1.amazonaws.com"], // ✅ allow this external domain
  },
};

export default nextConfig;
