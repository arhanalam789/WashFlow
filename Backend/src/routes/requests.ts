import { Router } from "express";
import { laundryRequestController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const requestRouter = Router();

requestRouter.get("/", requireAuth(), asyncHandler(laundryRequestController.list));
requestRouter.post(
  "/",
  requireAuth(["customer"]),
  asyncHandler(laundryRequestController.create),
);
requestRouter.patch(
  "/:id/assign",
  requireAuth(["admin"]),
  asyncHandler(laundryRequestController.assign),
);
requestRouter.patch(
  "/:id/status",
  requireAuth(["manager", "admin"]),
  asyncHandler(laundryRequestController.updateStatus),
);
requestRouter.delete(
  "/:id",
  requireAuth(["customer", "admin"]),
  asyncHandler(laundryRequestController.cancel),
);

export default requestRouter;
