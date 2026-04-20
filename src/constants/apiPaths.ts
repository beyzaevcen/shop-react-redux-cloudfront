const API_PATHS = {
  product:
    import.meta.env.VITE_PRODUCT_API_URL ||
    "https://7b4a1qjqz2.execute-api.us-east-1.amazonaws.com/prod",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
};

export default API_PATHS;
