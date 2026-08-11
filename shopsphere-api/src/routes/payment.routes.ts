import { Router } from "express";
import { authenticate ,authorizeAdmin} from "../middleware/auth.middleware";
import {
  createPaymentController,
  getPaymentController,
  updatePaymentController,
} from "../controllers/payment.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createPaymentController
);

router.get(
  "/order/:id",
  authenticate,
  getPaymentController
);



router.patch(
  "/:id",
   authorizeAdmin,
  updatePaymentController
);
export default router;