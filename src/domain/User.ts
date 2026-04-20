import { Entity } from "../core/Entity";
import { UserRole } from "./types";

export class User extends Entity {
  constructor(
    id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt);
  }

  isManager(): boolean {
    return this.role === UserRole.Manager;
  }
}
