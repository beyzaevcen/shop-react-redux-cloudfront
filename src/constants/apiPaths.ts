const API_PATHS = {
  product:
    import.meta.env.VITE_PRODUCT_API_URL ||
    "https://7b4a1qjqz2.execute-api.us-east-1.amazonaws.com/prod",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import:
    import.meta.env.VITE_IMPORT_API_URL ||
    "https://qowmrqhjp1.execute-api.us-east-1.amazonaws.com/prod",
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: "https://cc2zmoqg7l.execute-api.us-east-1.amazonaws.com/prod/api",
};

export default API_PATHS;
