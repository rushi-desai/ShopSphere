import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid("Invalid product ID"),
        quantity: z
          .number()
          .int()
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "Order must contain at least one item"),
});