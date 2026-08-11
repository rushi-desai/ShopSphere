import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

import {
  getProductReviewsController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
  adminDeleteReviewController,
  adminHideReviewController,
} from "../controllers/review.controller";

const router = Router();

// Public
router.get(
  "/product/:productId",
  getProductReviewsController
);

// Customer
router.post(
  "/product/:productId",
  authenticate,
  createReviewController
);

router.patch(
  "/:id",
  authenticate,
  updateReviewController
);

router.delete(
  "/:id",
  authenticate,
  deleteReviewController
);

// Admin
router.delete(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  adminDeleteReviewController
);

router.patch(
  "/admin/:id/hide",
  authenticate,
  authorize("ADMIN"),
  adminHideReviewController
);

export default router;