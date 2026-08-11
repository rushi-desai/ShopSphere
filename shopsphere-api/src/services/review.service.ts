import prisma from "../config/prisma";

export const getProductReviews = async (
  productId: string
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isActive: true,
      deletedAt: null,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.review.findMany({
    where: {
      productId,
      isVisible: true,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  title?: string,
  comment?: string
) => {
  // Check product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isActive: true,
      deletedAt: null,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check whether user already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product"
    );
  }

  // Check whether user purchased this product
  const purchasedProduct = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: {
          in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    },
  });

  if (!purchasedProduct) {
    throw new Error(
      "You can only review products you have purchased"
    );
  }

  return prisma.review.create({
    data: {
      userId,
      productId,
      rating,
     title: title ?? null,
    comment: comment ?? null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateReview = async (
  userId: string,
  reviewId: string,
  data: {
    rating?: number;
    title?: string;
    comment?: string;
  }
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (
    data.rating !== undefined &&
    (data.rating < 1 || data.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data,
  });
};

export const deleteReview = async (
  userId: string,
  reviewId: string
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return {
    message: "Review deleted successfully",
  };
};

export const adminDeleteReview = async (
  reviewId: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return {
    message: "Review deleted successfully",
  };
};

export const adminHideReview = async (
  reviewId: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isVisible: false,
    },
  });
};