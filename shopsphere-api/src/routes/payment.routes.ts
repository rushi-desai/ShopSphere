import { Router } from "express";
import { authenticate ,authorizeAdmin } from "../middleware/auth.middleware";
import {
  createPaymentController,
  getPaymentController,
  updatePaymentController,
} from "../controllers/payment.controller";
import { validate } from "../middleware/validate";
import { createPaymentSchema ,updatePaymentSchema } from "../utils/validators/payment.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createPaymentSchema),
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
   validate(updatePaymentSchema),
  updatePaymentController
);
export default router;