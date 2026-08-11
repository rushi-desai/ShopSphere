import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.uuid("Invalid order ID"),
});

export const updatePaymentSchema = z.object({
  status: z.enum(["PAID", "FAILED"]),
});