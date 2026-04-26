import User, { type UserDocument, type UserRole } from "../models/user.model";
import type { IUserRepository } from "./interfaces/user-repository.interface";

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  assignedCenterId?: string | null;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async findPublicById(id: string) {
    return User.findById(id).select("_id name email role assignedCenterId createdAt");
  }

  async create(input: CreateUserInput) {
    return User.create(input);
  }

  toPublic(user: UserDocument & { _id: unknown }) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      assignedCenterId: user.assignedCenterId
        ? String(user.assignedCenterId)
        : null,
      createdAt: user.createdAt,
    };
  }
}
