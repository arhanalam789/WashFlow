import { AppError } from "../utils/app-error";
import type { IConcernTicketRepository } from "../repositories/interfaces/concern-ticket-repository.interface";
import type { ILaundryRequestRepository } from "../repositories/interfaces/laundry-request-repository.interface";
import type { NotificationService } from "./notification.service";

interface CreateConcernInput {
  requestId?: string;
  type?: "missing_item" | "count_mismatch" | "delivery_issue" | "general_issue";
  expectedCount?: number;
  receivedCount?: number;
  note?: string;
  raisedByManagerId: string;
}

export class ConcernService {
  constructor(
    private readonly concernTicketRepository: IConcernTicketRepository,
    private readonly laundryRequestRepository: ILaundryRequestRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async listByRole(userId: string, role: string) {
    return this.concernTicketRepository.listByRole(userId, role);
  }

  async createConcern(input: CreateConcernInput) {
    const {
      requestId,
      type,
      expectedCount,
      receivedCount,
      note,
      raisedByManagerId,
    } = input;

    if (!requestId || !type) {
      throw new AppError(400, "Request and concern type are required.");
    }

    const request = await this.laundryRequestRepository.findById(requestId);

    if (!request) {
      throw new AppError(404, "Related request not found.");
    }

    const concern = await this.concernTicketRepository.create({
      requestId,
      raisedByManagerId,
      type,
      expectedCount: expectedCount ?? request.clothesCount,
      receivedCount: receivedCount ?? request.clothesCount,
      note: note || "",
    });

    request.status = "concern_raised";
    await this.laundryRequestRepository.save(request);

    await this.notificationService.createConcernRaised(
      String(request.userId),
      String(request._id),
    );

    return this.concernTicketRepository.findByIdWithRelations(String(concern._id));
  }

  async confirmConcern(concernId: string, userId: string, role: string) {
    const concern = await this.concernTicketRepository.findById(concernId);

    if (!concern) {
      throw new AppError(404, "Concern ticket not found.");
    }

    const request = await this.laundryRequestRepository.findById(String(concern.requestId));

    if (!request) {
      throw new AppError(404, "Related request not found.");
    }

    if (role === "customer" && String(request.userId) !== userId) {
      throw new AppError(
        403,
        "You can only confirm concern tickets for your own requests.",
      );
    }

    if (!concern.customerConfirmed) {
      concern.customerConfirmed = true;
      concern.confirmedAt = new Date();
      await this.concernTicketRepository.save(concern);

      await this.notificationService.createConcernConfirmed(
        String(request.userId),
        String(request._id),
      );
    }

    return this.concernTicketRepository.findByIdWithRelations(String(concern._id));
  }
}
