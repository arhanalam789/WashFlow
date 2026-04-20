import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/user.model";
import type { AuthenticatedRequest, AuthTokenPayload } from "../types/auth";

const jwtSecret = process.env.JWT_SECRET || "washflow-dev-secret";

export const requireAuth = (roles?: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined;

    if (!token) {
      res.status(401).json({ message: "Authentication token is required." });
      return;
    }

    try {
      const payload = jwt.verify(token, jwtSecret) as AuthTokenPayload;
      req.user = payload;

      if (roles && !roles.includes(payload.role)) {
        res.status(403).json({ message: "You do not have access to this action." });
        return;
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token.", error });
    }
  };
};
