/** @type {import('next').NextConfig} */
const nextConfig = {
    // The assetPrefix tells Next.js where to load static files from in production.
    assetPrefix: 'http://med-chatbot-static-assets.s3-website.eu-north-1.amazonaws.com', // <-- VERIFY THIS URL
};

export default nextConfig;;