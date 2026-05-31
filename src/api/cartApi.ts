import { Product } from "~/models/Product";

const CART_API_URL =
  "https://cc2zmoqg7l.execute-api.us-east-1.amazonaws.com/prod";

function getAuthHeader(username: string, password: string): string {
  return "Basic " + btoa(`${username}:${password}`);
}

export type ApiCartItem = {
  id: string;
  productId: string;
  count: number;
};

export async function getCart(
  username: string,
  password: string
): Promise<ApiCartItem[]> {
  const res = await fetch(`${CART_API_URL}/api/profile/cart`, {
    headers: { Authorization: getAuthHeader(username, password) },
  });
  return res.json();
}

export async function updateCart(
  username: string,
  password: string,
  product: Product,
  count: number
): Promise<ApiCartItem[]> {
  const res = await fetch(`${CART_API_URL}/api/profile/cart`, {
    method: "PUT",
    headers: {
      Authorization: getAuthHeader(username, password),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product, count }),
  });
  return res.json();
}

export async function clearCart(
  username: string,
  password: string
): Promise<void> {
  await fetch(`${CART_API_URL}/api/profile/cart`, {
    method: "DELETE",
    headers: { Authorization: getAuthHeader(username, password) },
  });
}

export async function checkout(
  username: string,
  password: string,
  address: {
    firstName: string;
    lastName: string;
    address: string;
    comment: string;
  }
) {
  const res = await fetch(`${CART_API_URL}/api/profile/cart/order`, {
    method: "PUT",
    headers: {
      Authorization: getAuthHeader(username, password),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });
  return res.json();
}
