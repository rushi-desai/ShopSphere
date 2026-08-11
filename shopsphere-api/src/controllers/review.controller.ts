import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  adminDeleteReview,
  adminHideReview,
} from "../services/review.service";

export const getProductReviewsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;

    if (typeof productId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const reviews = await getProductReviews(productId);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get reviews",
    });
  }
};

export const createReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (typeof productId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await createReview(
      req.user!.userId,
      productId,
      rating,
      title,
      comment
    );

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create review",
    });
  }
};

export const updateReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await updateReview(
      req.user!.userId,
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update review",
    });
  }
};

export const deleteReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const result = await deleteReview(
      req.user!.userId,
      id
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete review",
    });
  }
};

export const adminDeleteReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const result = await adminDeleteReview(id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete review",
    });
  }
};

export const adminHideReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await adminHideReview(id);

    return res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to hide review",
    });
  }
};