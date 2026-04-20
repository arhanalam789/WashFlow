import Notification from "../models/notification.model";
import type { INotificationRepository } from "./interfaces/notification-repository.interface";

export class NotificationRepository implements INotificationRepository {
  async findById(id: string) {
    return Notification.findById(id);
  }

  async create(input: {
    userId: string;
    requestId?: string | null;
    type: string;
    message: string;
    isRead?: boolean;
    sentAt?: Date;
  }) {
    return Notification.create({
      ...input,
      isRead: input.isRead ?? false,
      sentAt: input.sentAt ?? new Date(),
    });
  }

  async listByUser(userId: string) {
    return Notification.find({ userId })
      .sort({ sentAt: -1 })
      .populate({
        path: "requestId",
        populate: [
          { path: "userId", select: "name email role" },
          { path: "washingCenterId", select: "centerName location operationStatus" },
        ],
      });
  }

  async findByIdForUser(id: string, userId: string) {
    return Notification.findOne({
      _id: id,
      userId,
    });
  }

  async save(notification: InstanceType<typeof Notification>) {
    return notification.save();
  }

  async findByIdWithRelations(id: string) {
    return Notification.findById(id).populate({
      path: "requestId",
      populate: [
        { path: "userId", select: "name email role" },
        { path: "washingCenterId", select: "centerName location operationStatus" },
      ],
    });
  }
}
