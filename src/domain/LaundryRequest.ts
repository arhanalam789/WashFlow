import { Entity } from "../core/Entity";
import type { RequestObserver } from "../interfaces/RequestObserver";
import { Notification } from "./Notification";
import { NotificationType, RequestStatus } from "./types";

export class LaundryRequest extends Entity {
  private readonly observers = new Set<RequestObserver>();

  constructor(
    id: string,
    public userId: string,
    public washingCenterId: string | null,
    public clothesCount: number,
    public preferredPickupDate: Date,
    public status: RequestStatus = RequestStatus.Pending,
    createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt);
  }

  attachObserver(observer: RequestObserver): void {
    this.observers.add(observer);
  }

  assignCenter(centerId: string): void {
    this.washingCenterId = centerId;
    this.status = RequestStatus.Assigned;
    this.touch();
    this.notifyObservers(
      NotificationType.RequestAssigned,
      `Laundry request ${this.id} has been assigned to washing center ${centerId}.`,
    );
  }

  updateStatus(status: RequestStatus): void {
    this.status = status;
    this.touch();

    const type =
      status === RequestStatus.Completed
        ? NotificationType.RequestCompleted
        : NotificationType.RequestCreated;

    this.notifyObservers(
      type,
      `Laundry request ${this.id} status changed to ${status}.`,
    );
  }

  raiseConcern(): void {
    this.status = RequestStatus.ConcernRaised;
    this.touch();
    this.notifyObservers(
      NotificationType.ConcernRaised,
      `Concern ticket raised for laundry request ${this.id}.`,
    );
  }

  private notifyObservers(type: NotificationType, message: string): void {
    const notification = new Notification(
      `notif-${this.id}-${this.updatedAt.getTime()}`,
      this.userId,
      this.id,
      type,
      message,
    );

    for (const observer of this.observers) {
      observer.update(this, notification);
    }
  }
}
