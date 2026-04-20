import { Router } from "express";
import { authController } from "../container";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/async-handler";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(authController.signup));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.get("/me", requireAuth(), asyncHandler(authController.me));

export default authRouter;
