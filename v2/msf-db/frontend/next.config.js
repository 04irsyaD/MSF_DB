/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Kita bisa setup rewrite ke backend API lokal agar tidak terkendala CORS saat development
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production";
    // Port 8080 milik msf-app (v1). Backend v2 memakai 8001, lihat CLAUDE.md
    // bagian v2 Port Mapping. Nilai lama membuat frontend v2 dalam mode
    // development berbicara ke backend v1, dan itu tidak pernah ketahuan
    // karena v2 selalu dijalankan lewat Docker dalam mode produksi.
    const devBackend = process.env.BACKEND_ORIGIN || "http://localhost:8001";
    const dest = isProd
      ? "http://backend:8000/api/:path*"
      : `${devBackend}/api/:path*`;
    return [
      {
        source: "/api/:path*",
        destination: dest,
      },
    ];
  },
};

module.exports = nextConfig;
