import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  createAddressController,
  getAddressesController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/address.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createAddressController
);

router.get(
  "/",
  authenticate,
  getAddressesController
);

router.patch(
  "/:id",
  authenticate,
  updateAddressController
);

router.delete(
  "/:id",
  authenticate,
  deleteAddressController
);

export default router;