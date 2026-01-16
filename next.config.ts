import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Portfolio", // Replace "Portfolio" with your repo name if different
  trailingSlash: true,
};

export default nextConfig;