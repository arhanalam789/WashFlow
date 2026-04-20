import type { Auditable } from "./Auditable";

export abstract class Entity implements Auditable {
  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = createdAt,
  ) {}

  touch(date: Date = new Date()): void {
    this.updatedAt = date;
  }
}
