/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: 'https://nyc.cloud.appwrite.io/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
