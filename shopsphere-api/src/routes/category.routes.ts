import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller";

const router = Router();

// Public/customer access
router.get(
  "/",
  getCategoriesController
);

router.get(
  "/:id",
  getCategoryByIdController
);

// Admin only
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createCategoryController
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCategoryController
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCategoryController
);

export default router;