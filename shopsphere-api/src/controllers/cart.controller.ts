import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../services/cart.service";

export const getCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await getCart(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

export const addToCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId, quantity } = req.body;

    const item = await addToCart(
      req.user!.userId,
      productId,
      quantity
    );

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add item to cart",
    });
  }
};

export const updateCartItemController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { quantity } = req.body;

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing item id",
      });
    }

    const item = await updateCartItem(
      req.user!.userId,
      id,
      quantity
    );

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update cart item",
    });
  }
};

export const removeFromCartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing item id",
      });
    }

    const result = await removeFromCart(
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
          : "Failed to remove cart item",
    });
  }
};