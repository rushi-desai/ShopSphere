import { Router } from "express";
import { authenticate  } from "../middleware/auth.middleware";
import { updateOrderStatusController } from "../controllers/order.controller";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../utils/validators/order-validator";

import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
} from "../controllers/order.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  createOrderController
);

router.get(
  "/",
  authenticate,
  getMyOrdersController
);

router.get(
  "/:id",
  authenticate,
  getOrderByIdController
);


router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateOrderStatusController
);

export default router;