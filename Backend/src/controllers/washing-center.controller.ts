import type { NextFunction, Request, Response } from "express";
import type { WashingCenterService } from "../services/washing-center.service";

export class WashingCenterController {
  constructor(private readonly washingCenterService: WashingCenterService) {}

  list = async (_req: Request, res: Response, _next: NextFunction) => {
    const centers = await this.washingCenterService.listCenters();
    res.status(200).json(centers);
  };
}
