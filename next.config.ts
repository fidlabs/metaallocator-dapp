import { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
