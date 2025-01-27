/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Adds vendor prefixes for cross-browser compatibility
    'postcss-preset-env': { // Allows you to use modern CSS features and ensures compatibility
      stage: 1, // This enables the most modern CSS features
      features: {
        'nesting-rules': true, // Enables CSS nesting, which is useful for organizing styles
      },
    },
    cssnano: { // Minifies the final CSS output for production
      preset: 'default',
    },
  },
};

export default config;
