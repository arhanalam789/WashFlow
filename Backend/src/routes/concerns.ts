import { Router } from "express";
import { concernController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const concernRouter = Router();

concernRouter.get("/", requireAuth(), asyncHandler(concernController.list));
concernRouter.post(
  "/",
  requireAuth(["manager", "admin"]),
  asyncHandler(concernController.create),
);
concernRouter.patch(
  "/:id/confirm",
  requireAuth(["customer", "admin"]),
  asyncHandler(concernController.confirm),
);

export default concernRouter;
