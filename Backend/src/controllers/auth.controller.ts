import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "../services/auth.service";
import type { AuthenticatedRequest } from "../types/auth";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.authService.signup(req.body);
    res.status(201).json({
      ...result,
      message: "Signup successful.",
    });
  };

  login = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.authService.login(req.body);
    res.status(200).json({
      ...result,
      message: "Login successful.",
    });
  };

  me = async (req: Request, res: Response, _next: NextFunction) => {
    const authRequest = req as AuthenticatedRequest;
    const user = await this.authService.getCurrentUser(authRequest.user!.userId);
    res.status(200).json(user);
  };
}
