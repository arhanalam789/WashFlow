import { Entity } from "../core/Entity";
import { NotificationType } from "./types";

export class Notification extends Entity {
  constructor(
    id: string,
    public userId: string,
    public requestId: string,
    public type: NotificationType,
    public message: string,
    public isRead: boolean = false,
    createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt);
  }

  markAsRead(): void {
    this.isRead = true;
    this.touch();
  }
}
