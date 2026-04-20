import type { NotificationType } from "../models/notification.model";

interface NotificationPayload {
  type: NotificationType;
  message: string;
}

export class NotificationFactory {
  createRequestCreated(requestId: string): NotificationPayload {
    return {
      type: "request_created",
      message: `Laundry request ${requestId} was created successfully.`,
    };
  }

  createRequestAssigned(centerName: string): NotificationPayload {
    return {
      type: "request_assigned",
      message: `Your request has been assigned to ${centerName}.`,
    };
  }

  createStatusUpdated(status: string): NotificationPayload {
    const normalized = status.replace(/_/g, " ");
    const type =
      status === "completed"
        ? "request_completed"
        : status === "in_progress"
          ? "request_in_progress"
          : "general_update";

    return {
      type,
      message: `Your request status has been updated to ${normalized}.`,
    };
  }

  createConcernRaised(): NotificationPayload {
    return {
      type: "concern_raised",
      message: "A concern ticket has been raised for your laundry request.",
    };
  }

  createConcernConfirmed(): NotificationPayload {
    return {
      type: "concern_confirmed",
      message: "You confirmed the concern ticket for this laundry request.",
    };
  }

  createGeneralUpdate(message: string): NotificationPayload {
    return {
      type: "general_update",
      message,
    };
  }
}
