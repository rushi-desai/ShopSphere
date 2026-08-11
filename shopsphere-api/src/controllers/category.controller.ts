import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

export const getCategoriesController = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};

export const getCategoryByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await getCategoryById(id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Category not found",
    });
  }
};

export const createCategoryController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const category = await createCategory({
      name,
      slug,
      description,
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category",
    });
  }
};

export const updateCategoryController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await updateCategory(
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category",
    });
  }
};

export const deleteCategoryController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const result = await deleteCategory(id);

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
          : "Failed to delete category",
    });
  }
};