import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ConcernService } from "../../src/services/concern.service";
import { AppError } from "../../src/utils/app-error";

class FakeConcernTicketRepository {
  public createdInputs: any[] = [];

  async findById() {
    return null;
  }

  async findByIdWithRelations(id: string) {
    return {
      _id: id,
      ...this.createdInputs[this.createdInputs.length - 1],
    };
  }

  async listByRole() {
    return [];
  }

  async create(input: any) {
    this.createdInputs.push(input);
    return {
      _id: "concern-1",
      ...input,
    };
  }

  async save(concern: any) {
    return concern;
  }
}

class FakeLaundryRequestRepository {
  public requestsById = new Map<string, any>();

  async findById(id: string) {
    return this.requestsById.get(id) || null;
  }

  async save(request: any) {
    this.requestsById.set(String(request._id), request);
    return request;
  }
}

class FakeNotificationService {
  public events: string[] = [];

  async createConcernRaised() {
    this.events.push("concern_raised");
  }

  async createConcernConfirmed() {
    this.events.push("concern_confirmed");
  }
}

function createService() {
  const concernTicketRepository = new FakeConcernTicketRepository();
  const laundryRequestRepository = new FakeLaundryRequestRepository();
  const notificationService = new FakeNotificationService();
  const service = new ConcernService(
    concernTicketRepository as any,
    laundryRequestRepository as any,
    notificationService as any,
  );

  return {
    concernTicketRepository,
    laundryRequestRepository,
    notificationService,
    service,
  };
}

describe("ConcernService", () => {
  it("blocks managers from raising concerns for another center", async () => {
    const { laundryRequestRepository, service } = createService();
    laundryRequestRepository.requestsById.set("request-1", {
      _id: "request-1",
      userId: "customer-1",
      washingCenterId: "center-2",
      clothesCount: 4,
      status: "in_progress",
    });

    await assert.rejects(
      () =>
        service.createConcern({
          requestId: "request-1",
          type: "count_mismatch",
          raisedByManagerId: "manager-1",
          actorRole: "manager",
          actorAssignedCenterId: "center-1",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 403 &&
        error.message.includes("assigned washing center"),
    );
  });

  it("creates a concern, moves the request to concern raised, and notifies the customer", async () => {
    const {
      concernTicketRepository,
      laundryRequestRepository,
      notificationService,
      service,
    } = createService();
    laundryRequestRepository.requestsById.set("request-1", {
      _id: "request-1",
      userId: "customer-1",
      washingCenterId: "center-1",
      clothesCount: 4,
      status: "in_progress",
    });

    const concern = await service.createConcern({
      requestId: "request-1",
      type: "count_mismatch",
      expectedCount: 4,
      receivedCount: 3,
      raisedByManagerId: "manager-1",
      actorRole: "manager",
      actorAssignedCenterId: "center-1",
    });

    assert.equal(concern._id, "concern-1");
    assert.equal(laundryRequestRepository.requestsById.get("request-1").status, "concern_raised");
    assert.equal(concernTicketRepository.createdInputs[0].receivedCount, 3);
    assert.deepEqual(notificationService.events, ["concern_raised"]);
  });
});
