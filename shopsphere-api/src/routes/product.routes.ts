import { Router } from "express";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate";
import { createProductSchema , updateProductSchema } from "../utils/validators/product.schema";
import { authenticate } from "../middleware/auth.middleware";
import {
  getProductsController,
  createProductController,
  getProductByIdController,
  updateProductController,
   deleteProductController,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProductsController);
router.post("/",authenticate,authorize("ADMIN"),validate(createProductSchema), createProductController);
router.get("/:id", getProductByIdController);
router.patch("/:id",authenticate,authorize("ADMIN"),validate(updateProductSchema), updateProductController);
router.delete("/:id",authenticate,authorize("ADMIN"), deleteProductController);

export default router;