import type { NextFunction, Request, Response } from "express";
import type { NotificationService } from "../services/notification.service";
import type { AuthenticatedRequest } from "../types/auth";
import { AppError } from "../utils/app-error";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  list = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const notifications = await this.notificationService.listForUser(
      authRequest.user!.userId,
    );
    res.status(200).json(notifications);
  };

  create = async (req: Request, res: Response, _next: NextFunction) => {
    const { userId, requestId, message } = req.body as {
      userId?: string;
      requestId?: string;
      message?: string;
    };

    if (!userId || !message) {
      throw new AppError(400, "User and message are required.");
    }

    const notification = await this.notificationService.sendGeneralUpdate(
      userId,
      requestId || null,
      message,
    );

    res.status(201).json(notification);
  };

  markAsRead = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const notification = await this.notificationService.markAsRead(
      String(req.params.id),
      authRequest.user!.userId,
    );
    res.status(200).json(notification);
  };
}
