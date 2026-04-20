import type { RequestObserver } from "../interfaces/RequestObserver";
import { LaundryRequest } from "../domain/LaundryRequest";
import { Notification } from "../domain/Notification";

export class NotificationService implements RequestObserver {
  private readonly notifications: Notification[] = [];

  update(_request: LaundryRequest, notification: Notification): void {
    this.notifications.push(notification);
  }

  all(): Notification[] {
    return [...this.notifications];
  }
}
