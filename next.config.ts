import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // الصور تُعرض بوسم <img> مباشرة من روابط Laravel (APP_URL/storage/...)
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
