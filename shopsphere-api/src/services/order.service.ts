import { OrderStatus } from "@prisma/client";
import prisma from "../config/prisma";

export const createOrder = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.product.isActive || item.product.deletedAt) {
      throw new Error(
        `Product ${item.product.name} is no longer available`
      );
    }

    if (item.product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.product.name}`
      );
    }
  }

  const subtotal = cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const shippingFee = 0;
  const tax = 0;
  const discount = 0;
  const total = subtotal + shippingFee + tax - discount;

  const orderNumber = `ORD-${Date.now()}`;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: "PENDING",
        paymentStatus: "PENDING",

        subtotal,
        shippingFee,
        tax,
        discount,
        total,

        shippingFullName: "",
        shippingLine1: "",
        shippingCity: "",
        shippingState: "",
        shippingPostalCode: "",
        shippingCountry: "IN",

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            unitPrice: item.product.price,
            quantity: item.quantity,
            totalPrice:
              Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return newOrder;
  });

  return order;
};



export const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const getOrderById = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  return order;
};