import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { CartItem } from "~/models/CartItem";
import { Product } from "~/models/Product";
import { Address } from "~/models/Order";
import { getCart, updateCart, checkout } from "~/api/cartApi";

function getCredentials(): [string, string] {
  const token = localStorage.getItem("authorization_token") ?? "";
  try {
    const decoded = globalThis.atob(token);
    const idx = decoded.indexOf(":");
    return [decoded.slice(0, idx), decoded.slice(idx + 1)];
  } catch {
    return ["", ""];
  }
}

export function useCart() {
  const queryClient = useQueryClient();
  return useQuery<CartItem[], Error>("cart", async () => {
    const [username, password] = getCredentials();
    const apiItems = await getCart(username, password);
    if (!Array.isArray(apiItems)) return [];

    const products =
      queryClient.getQueryData<Product[]>("products-list") ?? [];

    return apiItems.map((item) => ({
      product: (products.find((p) => p.id === item.productId) ?? {
        id: item.productId,
        title: item.productId,
        description: "",
        price: 0,
      }) as Product,
      count: item.count,
    }));
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) => {
    const [username, password] = getCredentials();
    return updateCart(username, password, values.product as Product, values.count);
  });
}

export function useCheckout() {
  return useMutation((address: Address) => {
    const [username, password] = getCredentials();
    return checkout(username, password, address);
  });
}
