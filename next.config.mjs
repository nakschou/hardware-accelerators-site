/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enable static exports
  basePath: "/hardware-accelerators-site", // Replace with your repo name
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
