/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dk6brgbg5/image/upload",
  },
};

module.exports = nextConfig;
