import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "User already exists"
    ) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};


export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};