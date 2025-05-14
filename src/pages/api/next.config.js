{import('next').NextConfig} 
module.exports = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    //domains: ['localhost'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/brasao/**",
      },
    ],
  },
};
