import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
} from "../controllers/cart.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  getCartController
);

router.post(
  "/items",
  authenticate,
  addToCartController
);

router.patch(
  "/items/:id",
  authenticate,
  updateCartItemController
);

router.delete(
  "/items/:id",
  authenticate,
  removeFromCartController
);

export default router;