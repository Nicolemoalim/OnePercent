const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  IMAGE_URL: process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images',
  TOKEN_KEY: 'token',
  CART_KEY: 'cart_items',
};

export default config;