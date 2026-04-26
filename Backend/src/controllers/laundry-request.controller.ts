import type { NextFunction, Request, Response } from "express";
import type { LaundryRequestService } from "../services/laundry-request.service";
import type { AuthenticatedRequest } from "../types/auth";

export class LaundryRequestController {
  constructor(private readonly laundryRequestService: LaundryRequestService) {}

  list = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const requests = await this.laundryRequestService.listByRole(
      authRequest.user!.userId,
      authRequest.user!.role,
      authRequest.user!.assignedCenterId,
    );
    res.status(200).json(requests);
  };

  create = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const request = await this.laundryRequestService.createRequest({
      userId: authRequest.user!.userId,
      ...req.body,
    });
    res.status(201).json(request);
  };

  assign = async (req: Request, res: Response, _next: NextFunction) => {
    const request = await this.laundryRequestService.assignRequest(
      String(req.params.id),
      req.body.washingCenterId,
    );
    res.status(200).json(request);
  };

  updateStatus = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const request = await this.laundryRequestService.updateStatus(
      String(req.params.id),
      req.body.status,
      {
        userId: authRequest.user!.userId,
        role: authRequest.user!.role,
        assignedCenterId: authRequest.user!.assignedCenterId,
      },
    );
    res.status(200).json(request);
  };
}
