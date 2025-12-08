/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://localhost:8080/:path*", // 백엔드 서버 주소
      },
    ];
  },
};

export default nextConfig;
