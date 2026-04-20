import type { NextFunction, Request, Response } from "express";
import type { ConcernService } from "../services/concern.service";
import type { AuthenticatedRequest } from "../types/auth";

export class ConcernController {
  constructor(private readonly concernService: ConcernService) {}

  list = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const concerns = await this.concernService.listByRole(
      authRequest.user!.userId,
      authRequest.user!.role,
    );
    res.status(200).json(concerns);
  };

  create = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const concern = await this.concernService.createConcern({
      ...req.body,
      raisedByManagerId: authRequest.user!.userId,
    });
    res.status(201).json(concern);
  };

  confirm = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const concern = await this.concernService.confirmConcern(
      String(req.params.id),
      authRequest.user!.userId,
      authRequest.user!.role,
    );
    res.status(200).json(concern);
  };
}
