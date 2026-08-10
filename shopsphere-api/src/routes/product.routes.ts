import { Router } from "express";
import { validate } from "../middleware/validate";
import { createProductSchema , updateProductSchema } from "../utils/validators/product.schema";

import {
  getProductsController,
  createProductController,
  getProductByIdController,
  updateProductController,
   deleteProductController,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProductsController);
router.post("/", validate(createProductSchema), createProductController);
router.get("/:id", getProductByIdController);
router.patch("/:id",validate(updateProductSchema), updateProductController);
router.delete("/:id", deleteProductController);

export default router;