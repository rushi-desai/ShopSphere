import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});


export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
});