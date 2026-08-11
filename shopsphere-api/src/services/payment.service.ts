import prisma from "../config/prisma";
import crypto from "crypto";

export const createPayment = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    throw new Error("Order is already paid");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
  });

  if (existingPayment) {
    return existingPayment;
  }

  const payment = await prisma.payment.create({
    data: {
      orderId,
      userId,
      amount: order.total,
      status: "PENDING",
      provider: "TEST",
    },
  });

  return payment;
};

export const getPaymentByOrderId = async (
  userId: string,
  orderId: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      orderId,
      userId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "PAID" | "FAILED"
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "PENDING") {
    throw new Error("Payment has already been processed");
  }

  const updatedPayment = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status,
        transactionId:
          status === "PAID"
            ? `TEST-${crypto.randomUUID()}`
            : null,
      },
    });

    if (status === "PAID") {
      await tx.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          paymentStatus: "PAID",
        },
      });
    }

    return payment;
  });

  return updatedPayment;
};