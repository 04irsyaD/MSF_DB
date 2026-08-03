/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Kita bisa setup rewrite ke backend API lokal agar tidak terkendala CORS saat development
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";
    const dest = isProd ? "http://backend:8000/api/:path*" : "http://localhost:8080/api/:path*";
    return [
      {
        source: "/api/:path*",
        destination: dest,
      },
    ];
  },
};

module.exports = nextConfig;
