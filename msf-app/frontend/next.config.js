/** @type {import('next').NextConfig} */
// Header keamanan untuk semua halaman (backend sudah punya sendiri lewat middleware FastAPI).
// CSP sengaja hanya frame-ancestors: CSP penuh perlu diuji dulu dengan Monaco (skrip dari CDN).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
