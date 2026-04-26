import { AppError } from "../utils/app-error";
import type { IConcernTicketRepository } from "../repositories/interfaces/concern-ticket-repository.interface";
import type { ILaundryRequestRepository } from "../repositories/interfaces/laundry-request-repository.interface";

interface CreateConcernInput {
  requestId?: string;
  type?: "missing_item" | "count_mismatch" | "delivery_issue" | "general_issue";
  expectedCount?: number;
  receivedCount?: number;
  note?: string;
  raisedByManagerId: string;
  actorRole: string;
  actorAssignedCenterId?: string | null;
}

interface ConcernNotificationWriter {
  createConcernRaised(userId: string, requestId: string): Promise<any>;
  createConcernConfirmed(userId: string, requestId: string): Promise<any>;
}

export class ConcernService {
  constructor(
    private readonly concernTicketRepository: IConcernTicketRepository,
    private readonly laundryRequestRepository: ILaundryRequestRepository,
    private readonly notificationService: ConcernNotificationWriter,
  ) {}

  async listByRole(
    userId: string,
    role: string,
    assignedCenterId?: string | null,
  ) {
    return this.concernTicketRepository.listByRole(
      userId,
      role,
      assignedCenterId,
    );
  }

  async createConcern(input: CreateConcernInput) {
    const {
      requestId,
      type,
      expectedCount,
      receivedCount,
      note,
      raisedByManagerId,
      actorRole,
      actorAssignedCenterId,
    } = input;

    if (!requestId || !type) {
      throw new AppError(400, "Request and concern type are required.");
    }

    const request = await this.laundryRequestRepository.findById(requestId);

    if (!request) {
      throw new AppError(404, "Related request not found.");
    }

    if (actorRole === "manager") {
      this.ensureManagerOwnsRequest(request, actorAssignedCenterId);
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

  private ensureManagerOwnsRequest(
    request: { washingCenterId?: unknown },
    assignedCenterId?: string | null,
  ) {
    if (!assignedCenterId) {
      throw new AppError(
        403,
        "Managers must be assigned to a washing center before raising concerns.",
      );
    }

    if (String(request.washingCenterId || "") !== assignedCenterId) {
      throw new AppError(
        403,
        "Managers can only raise concerns for their assigned washing center.",
      );
    }
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
