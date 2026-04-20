import type { LaundryRequest } from "../domain/LaundryRequest";
import type { Notification } from "../domain/Notification";

export interface RequestObserver {
  update(request: LaundryRequest, notification: Notification): void;
}
