import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../services/address.service";

export const createAddressController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const address = await createAddress(
      req.user!.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create address",
    });
  }
};

export const getAddressesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const addresses = await getAddresses(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get addresses",
    });
  }
};

export const updateAddressController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const address = await updateAddress(
      req.user!.userId,
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update address",
    });
  }
};

export const deleteAddressController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const result = await deleteAddress(
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
          : "Failed to delete address",
    });
  }
};