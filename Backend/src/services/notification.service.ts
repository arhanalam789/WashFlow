import type { INotificationRepository } from "../repositories/interfaces/notification-repository.interface";
import type { NotificationFactory } from "../factories/notification.factory";
import { AppError } from "../utils/app-error";

export class NotificationService {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  async listForUser(userId: string) {
    return this.notificationRepository.listByUser(userId);
  }

  async createRequestCreated(userId: string, requestId: string) {
    const payload = this.notificationFactory.createRequestCreated(requestId);
    return this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });
  }

  async createRequestAssigned(
    userId: string,
    requestId: string,
    centerName: string,
  ) {
    const payload = this.notificationFactory.createRequestAssigned(centerName);
    return this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });
  }

  async createStatusUpdated(userId: string, requestId: string, status: string) {
    const payload = this.notificationFactory.createStatusUpdated(status);
    return this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });
  }

  async createConcernRaised(userId: string, requestId: string) {
    const payload = this.notificationFactory.createConcernRaised();
    return this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });
  }

  async createConcernConfirmed(userId: string, requestId: string) {
    const payload = this.notificationFactory.createConcernConfirmed();
    return this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });
  }

  async sendGeneralUpdate(userId: string, requestId: string | null, message: string) {
    const payload = this.notificationFactory.createGeneralUpdate(message);
    const notification = await this.notificationRepository.create({
      userId,
      requestId,
      ...payload,
    });

    return this.notificationRepository.findByIdWithRelations(String(notification._id));
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findByIdForUser(
      notificationId,
      userId,
    );

    if (!notification) {
      throw new AppError(404, "Notification not found.");
    }

    notification.isRead = true;
    await this.notificationRepository.save(notification);

    return notification;
  }
}
