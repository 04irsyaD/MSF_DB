/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Kita bisa setup rewrite ke backend API lokal agar tidak terkendala CORS saat development
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";
    const defaultHost = isProd ? "http://backend:8000" : "http://localhost:8080";
    const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || defaultHost;
    const dest = backendBase.endsWith("/api")
      ? `${backendBase}/:path*`
      : `${backendBase.replace(/\/$/, "")}/api/:path*`;
    return [
      {
        source: "/api/:path*",
        destination: dest,
      },
    ];
  },
};

module.exports = nextConfig;
