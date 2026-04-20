import type { UserDocument, UserRole } from "../../models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  findPublicById(id: string): Promise<any>;
  create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<any>;
  toPublic(user: UserDocument & { _id: unknown }): {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
  };
}
