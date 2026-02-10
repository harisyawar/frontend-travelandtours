/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true, // Disable Image Optimization API for standalone builds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "northpointtravel.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
