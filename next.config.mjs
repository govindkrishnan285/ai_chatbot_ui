/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use the secure CloudFront URL
    assetPrefix: 'http://localhost:3000', // <-- VERIFY THIS URL
};

export default nextConfig;