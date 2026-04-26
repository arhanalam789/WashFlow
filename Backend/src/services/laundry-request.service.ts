import { AppError } from "../utils/app-error";
import type { ILaundryRequestRepository } from "../repositories/interfaces/laundry-request-repository.interface";

interface CreateLaundryRequestInput {
  userId: string;
  clothesCount?: number;
  preferredPickupDate?: string;
  washingCenterId?: string;
}

interface RequestActor {
  userId: string;
  role: string;
  assignedCenterId?: string | null;
}

interface WashingCenterLookup {
  findCenterById(id: string): Promise<any>;
}

interface RequestNotificationWriter {
  createRequestCreated(userId: string, requestId: string): Promise<any>;
  createRequestAssigned(
    userId: string,
    requestId: string,
    centerName: string,
  ): Promise<any>;
  createStatusUpdated(
    userId: string,
    requestId: string,
    status: string,
  ): Promise<any>;
}

const allowedStatusTransitions: Record<string, string[]> = {
  pending: [],
  assigned: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
  concern_raised: ["in_progress", "completed"],
};

export class LaundryRequestService {
  constructor(
    private readonly laundryRequestRepository: ILaundryRequestRepository,
    private readonly washingCenterService: WashingCenterLookup,
    private readonly notificationService: RequestNotificationWriter,
  ) {}

  async listByRole(
    userId: string,
    role: string,
    assignedCenterId?: string | null,
  ) {
    return this.laundryRequestRepository.listByRole(
      userId,
      role,
      assignedCenterId,
    );
  }

  async createRequest(input: CreateLaundryRequestInput) {
    const {
      userId,
      clothesCount,
      preferredPickupDate,
      washingCenterId,
    } = input;

    if (!clothesCount || !preferredPickupDate) {
      throw new AppError(
        400,
        "Clothes count and preferred pickup date are required.",
      );
    }

    if (washingCenterId) {
      const center = await this.washingCenterService.findCenterById(washingCenterId);

      if (!center) {
        throw new AppError(404, "Selected washing center was not found.");
      }
    }

    const request = await this.laundryRequestRepository.create({
      userId,
      washingCenterId: washingCenterId || null,
      clothesCount,
      preferredPickupDate: new Date(preferredPickupDate),
      status: washingCenterId ? "assigned" : "pending",
    });

    await this.notificationService.createRequestCreated(userId, String(request._id));

    return this.laundryRequestRepository.findByIdWithRelations(String(request._id));
  }

  async assignRequest(requestId: string, washingCenterId?: string) {
    if (!washingCenterId) {
      throw new AppError(400, "Washing center is required for assignment.");
    }

    const [request, center] = await Promise.all([
      this.laundryRequestRepository.findById(requestId),
      this.washingCenterService.findCenterById(washingCenterId),
    ]);

    if (!request) {
      throw new AppError(404, "Laundry request not found.");
    }

    if (!center) {
      throw new AppError(404, "Washing center not found.");
    }

    request.washingCenterId = center._id;
    request.status = "assigned";
    await this.laundryRequestRepository.save(request);

    await this.notificationService.createRequestAssigned(
      String(request.userId),
      String(request._id),
      center.centerName,
    );

    return this.laundryRequestRepository.findByIdWithRelations(String(request._id));
  }

  async updateStatus(requestId: string, status?: string, actor?: RequestActor) {
    if (
      !status ||
      !["pending", "assigned", "in_progress", "completed", "concern_raised"].includes(
        status,
      )
    ) {
      throw new AppError(400, "A valid request status is required.");
    }

    const request = await this.laundryRequestRepository.findById(requestId);

    if (!request) {
      throw new AppError(404, "Laundry request not found.");
    }

    if (actor?.role === "manager") {
      this.ensureManagerOwnsRequest(request, actor.assignedCenterId);
    }

    const currentStatus = String(request.status);
    const allowedNextStatuses = allowedStatusTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      throw new AppError(
        400,
        `Cannot move request from ${currentStatus} to ${status}.`,
      );
    }

    request.status = status as never;
    await this.laundryRequestRepository.save(request);

    await this.notificationService.createStatusUpdated(
      String(request.userId),
      String(request._id),
      status,
    );

    return this.laundryRequestRepository.findByIdWithRelations(String(request._id));
  }

  private ensureManagerOwnsRequest(
    request: { washingCenterId?: unknown },
    assignedCenterId?: string | null,
  ) {
    if (!assignedCenterId) {
      throw new AppError(
        403,
        "Managers must be assigned to a washing center before processing requests.",
      );
    }

    if (String(request.washingCenterId || "") !== assignedCenterId) {
      throw new AppError(
        403,
        "Managers can only process requests for their assigned washing center.",
      );
    }
  }
}
