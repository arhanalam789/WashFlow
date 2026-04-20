import { Schema, model, models, Types, type Model } from "mongoose";

export type NotificationType =
  | "request_created"
  | "request_assigned"
  | "request_in_progress"
  | "request_completed"
  | "concern_raised"
  | "concern_confirmed"
  | "general_update";

export interface NotificationDocument {
  userId: Types.ObjectId;
  requestId?: Types.ObjectId | null;
  type: NotificationType;
  message: string;
  isRead: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "LaundryRequest",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "request_created",
        "request_assigned",
        "request_in_progress",
        "request_completed",
        "concern_raised",
        "concern_confirmed",
        "general_update",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Notification =
  (models.Notification as Model<NotificationDocument>) ||
  model<NotificationDocument>("Notification", notificationSchema);

export default Notification;
