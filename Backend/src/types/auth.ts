import type { Request } from "express";
import type { UserRole } from "../models/user.model";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  assignedCenterId?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}
