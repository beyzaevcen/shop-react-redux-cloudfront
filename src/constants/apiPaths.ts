const PRODUCTS_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL ??
  "https://7b4a1qjqz2.execute-api.us-east-1.amazonaws.com/prod";

const API_PATHS = {
  product: PRODUCTS_API_URL,
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  bff: PRODUCTS_API_URL,
  cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
};

export default API_PATHS;
