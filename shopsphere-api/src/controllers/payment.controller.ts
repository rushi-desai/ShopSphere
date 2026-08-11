import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createPayment,
  getPaymentByOrderId,
  updatePaymentStatus
} from "../services/payment.service";

export const createPaymentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orderId } = req.body;



    const payment = await createPayment(
      req.user!.userId,
      orderId
    );

    return res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create payment",
    });
  }
};

export const getPaymentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const payment = await getPaymentByOrderId(
      req.user!.userId,
      id
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Payment not found",
    });
  }
};



export const updatePaymentController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

  

   const payment = await updatePaymentStatus(
  
  id,
  status
);

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update payment",
    });
  }
};