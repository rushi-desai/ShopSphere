import prisma from "../config/prisma";

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
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

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
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
  }

  return cart;
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isActive || product.deletedAt) {
    throw new Error("Product is not available");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new Error("Insufficient stock");
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: true,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: {
      product: true,
    },
  });
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      product: true,
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (item.product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
    include: {
      product: true,
    },
  });
};

export const removeFromCart = async (
  userId: string,
  itemId: string
) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return {
    message: "Item removed from cart",
  };
};