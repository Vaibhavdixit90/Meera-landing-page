/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Enables static export
  // trailingSlash: true,

  images: {
    unoptimized: true, // Use unoptimized images for static export
  },

  // Enable SWC minification
  swcMinify: true, // Minifies JavaScript and CSS

  // Additional performance optimizations
  optimizeFonts: true, // Optimize font loading

  // Enable compression for better performance
  compress: true, // Uses gzip compression by default

  // Custom webpack configuration
  webpack(config) {
    return config;
  },
};

export default nextConfig;
