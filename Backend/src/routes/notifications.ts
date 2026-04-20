import { Router } from "express";
import { notificationController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const notificationRouter = Router();

notificationRouter.get("/", requireAuth(), asyncHandler(notificationController.list));
notificationRouter.post(
  "/",
  requireAuth(["admin"]),
  asyncHandler(notificationController.create),
);
notificationRouter.patch(
  "/:id/read",
  requireAuth(),
  asyncHandler(notificationController.markAsRead),
);

export default notificationRouter;
