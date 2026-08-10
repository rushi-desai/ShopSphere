import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createOrder , getMyOrders ,getOrderById  ,updateOrderStatus } from "../services/order.service";

export const createOrderController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const order = await createOrder(req.user!.userId);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
};



export const getMyOrdersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const orders = await getMyOrders(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};


export const getOrderByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await getOrderById(
      req.user!.userId,
      id
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Order not found",
    });
  }
};


export const updateOrderStatusController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await updateOrderStatus(id, status);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    });
  }
};