import { AppError } from "../utils/app-error";
import type { ILaundryRequestRepository } from "../repositories/interfaces/laundry-request-repository.interface";
import type { WashingCenterService } from "./washing-center.service";
import type { NotificationService } from "./notification.service";

interface CreateLaundryRequestInput {
  userId: string;
  clothesCount?: number;
  preferredPickupDate?: string;
  washingCenterId?: string;
}

export class LaundryRequestService {
  constructor(
    private readonly laundryRequestRepository: ILaundryRequestRepository,
    private readonly washingCenterService: WashingCenterService,
    private readonly notificationService: NotificationService,
  ) {}

  async listByRole(userId: string, role: string) {
    return this.laundryRequestRepository.listByRole(userId, role);
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

  async updateStatus(requestId: string, status?: string) {
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

    request.status = status as never;
    await this.laundryRequestRepository.save(request);

    await this.notificationService.createStatusUpdated(
      String(request.userId),
      String(request._id),
      status,
    );

    return this.laundryRequestRepository.findByIdWithRelations(String(request._id));
  }
}
