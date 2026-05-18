/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { hostname: 'congress.gov' },
      { hostname: 'house.gov' },
      { hostname: 'senate.gov' },
      { hostname: 'propublica.org' },
    ],
  },
};

module.exports = nextConfig;
