import { Router } from "express";
import { washingCenterController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const washingCenterRouter = Router();

washingCenterRouter.get("/", asyncHandler(washingCenterController.list));
washingCenterRouter.post(
  "/",
  requireAuth(["admin"]),
  asyncHandler(washingCenterController.create),
);

export default washingCenterRouter;
