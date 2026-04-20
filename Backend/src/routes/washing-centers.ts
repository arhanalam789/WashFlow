import { Router } from "express";
import { washingCenterController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const washingCenterRouter = Router();

washingCenterRouter.get("/", requireAuth(), asyncHandler(washingCenterController.list));

export default washingCenterRouter;
