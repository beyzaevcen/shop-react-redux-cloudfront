import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { Product } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

const PRODUCTS_ENDPOINT = `${API_PATHS.bff}/products`;

export function useAvailableProducts() {
  return useQuery<Product[], AxiosError>("available-products", async () => {
    const res = await axios.get<Product[]>(PRODUCTS_ENDPOINT);
    return res.data;
  });
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<Product, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: Product) => {
    if (values.id) {
      throw new Error("Product update endpoint is not deployed.");
    }

    return axios.post<Product>(`${API_PATHS.product}/products`, values);
  });
}

export function useDeleteAvailableProduct() {
  return useMutation(async () => {
    throw new Error("Product delete endpoint is not deployed.");
  });
}
