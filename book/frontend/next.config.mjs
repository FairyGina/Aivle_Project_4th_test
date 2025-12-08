/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // API 요청만 백엔드로 프록시
        source: "/book/:path*",
        destination: "http://localhost:8080/book/:path*",
      },
      {
        source: "/user/:path*",
        destination: "http://localhost:8080/user/:path*",
      },
    ];
  },
};

export default nextConfig;
