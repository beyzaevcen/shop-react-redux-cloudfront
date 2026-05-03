import * as Yup from "yup";

export const BaseProductSchema = Yup.object({
  id: Yup.string(),
  title: Yup.string().required().default(""),
  description: Yup.string().default(""),
  price: Yup.number().positive().required().defined().default(0),
});

export const ProductSchema = BaseProductSchema.shape({
  count: Yup.number().integer().min(0).required().defined().default(0),
});

export const AvailableProductSchema = ProductSchema;

export type BaseProduct = Yup.InferType<typeof BaseProductSchema>;
export type Product = Yup.InferType<typeof ProductSchema>;
export type AvailableProduct = Product;
