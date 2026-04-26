import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";
import type { UserRole } from "../models/user.model";
import type { IUserRepository } from "../repositories/interfaces/user-repository.interface";

const jwtSecret = process.env.JWT_SECRET || "washflow-dev-secret";

interface WashingCenterSelector {
  findCenterById(id: string): Promise<any>;
  listCenters(): Promise<any[]>;
}

interface SignupInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  assignedCenterId?: string | null;
}

interface LoginInput {
  email?: string;
  password?: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly washingCenterService?: WashingCenterSelector,
  ) {}

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async signup(input: SignupInput) {
    const { name, email, password, role = "customer" } = input;

    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required.");
    }

    if (!this.isValidEmail(email)) {
      throw new AppError(400, "Please enter a valid email address.");
    }

    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters long.");
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedCenterId = await this.resolveAssignedCenter(role, input.assignedCenterId);
    const user = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role,
      assignedCenterId,
    });

    return this.buildAuthResponse(user);
  }

  async login(input: LoginInput) {
    const { email, password } = input;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required.");
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password.");
    }

    return this.buildAuthResponse(user);
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findPublicById(userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return this.userRepository.toPublic(user);
  }

  private buildAuthResponse(user: {
    _id: unknown;
    email: string;
    role: UserRole;
    name: string;
    assignedCenterId?: unknown;
    createdAt: Date;
  }) {
    const assignedCenterId = user.assignedCenterId
      ? String(user.assignedCenterId)
      : null;

    const token = jwt.sign(
      {
        userId: String(user._id),
        email: user.email,
        role: user.role,
        assignedCenterId,
      },
      jwtSecret,
      { expiresIn: "1d" },
    );

    return {
      message: "Authentication successful.",
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        assignedCenterId,
        createdAt: user.createdAt,
      },
    };
  }

  private async resolveAssignedCenter(
    role: UserRole,
    assignedCenterId?: string | null,
  ) {
    if (role !== "manager") {
      return null;
    }

    if (!this.washingCenterService) {
      return assignedCenterId || null;
    }

    if (assignedCenterId) {
      const center = await this.washingCenterService.findCenterById(assignedCenterId);

      if (!center) {
        throw new AppError(404, "Assigned washing center was not found.");
      }

      return assignedCenterId;
    }

    const centers = await this.washingCenterService.listCenters();
    const firstCenter = centers[0];

    if (!firstCenter?._id) {
      throw new AppError(400, "At least one washing center is required for managers.");
    }

    return String(firstCenter._id);
  }
}
