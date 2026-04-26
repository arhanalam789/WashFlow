import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LaundryRequestService } from "../../src/services/laundry-request.service";
import { AppError } from "../../src/utils/app-error";

class FakeLaundryRequestRepository {
  public listCalls: Array<{
    userId: string;
    role: string;
    assignedCenterId?: string | null;
  }> = [];
  public requestsById = new Map<string, any>();

  async findById(id: string) {
    return this.requestsById.get(id) || null;
  }

  async findByIdWithRelations(id: string) {
    return this.requestsById.get(id) || null;
  }

  async create(input: any) {
    const request = {
      _id: "request-created",
      ...input,
    };
    this.requestsById.set(request._id, request);
    return request;
  }

  async listByRole(
    userId: string,
    role: string,
    assignedCenterId?: string | null,
  ) {
    this.listCalls.push({ userId, role, assignedCenterId });
    return [];
  }

  async save(request: any) {
    this.requestsById.set(String(request._id), request);
    return request;
  }
}

class FakeWashingCenterService {
  public centers = new Map<string, any>();

  async findCenterById(id: string) {
    return this.centers.get(id) || null;
  }
}

class FakeNotificationService {
  public events: string[] = [];

  async createRequestCreated() {
    this.events.push("request_created");
  }

  async createRequestAssigned() {
    this.events.push("request_assigned");
  }

  async createStatusUpdated() {
    this.events.push("status_updated");
  }
}

function createService() {
  const repository = new FakeLaundryRequestRepository();
  const washingCenterService = new FakeWashingCenterService();
  const notificationService = new FakeNotificationService();
  const service = new LaundryRequestService(
    repository as any,
    washingCenterService as any,
    notificationService as any,
  );

  return {
    repository,
    washingCenterService,
    notificationService,
    service,
  };
}

describe("LaundryRequestService", () => {
  it("passes assigned center ownership when listing manager requests", async () => {
    const { repository, service } = createService();

    await service.listByRole("manager-1", "manager", "center-1");

    assert.deepEqual(repository.listCalls, [
      {
        userId: "manager-1",
        role: "manager",
        assignedCenterId: "center-1",
      },
    ]);
  });

  it("blocks a manager from updating a request assigned to another center", async () => {
    const { repository, service } = createService();
    repository.requestsById.set("request-1", {
      _id: "request-1",
      userId: "customer-1",
      washingCenterId: "center-2",
      status: "assigned",
      save: async () => undefined,
    });

    await assert.rejects(
      () =>
        service.updateStatus("request-1", "in_progress", {
          userId: "manager-1",
          role: "manager",
          assignedCenterId: "center-1",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 403 &&
        error.message.includes("assigned washing center"),
    );
  });

  it("rejects invalid request status transitions", async () => {
    const { repository, service } = createService();
    repository.requestsById.set("request-1", {
      _id: "request-1",
      userId: "customer-1",
      washingCenterId: "center-1",
      status: "pending",
      save: async () => undefined,
    });

    await assert.rejects(
      () =>
        service.updateStatus("request-1", "completed", {
          userId: "admin-1",
          role: "admin",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 400 &&
        error.message.includes("Cannot move request"),
    );
  });

  it("moves assigned requests to in progress and creates a notification", async () => {
    const { notificationService, repository, service } = createService();
    repository.requestsById.set("request-1", {
      _id: "request-1",
      userId: "customer-1",
      washingCenterId: "center-1",
      status: "assigned",
      save: async () => undefined,
    });

    const request = await service.updateStatus("request-1", "in_progress", {
      userId: "manager-1",
      role: "manager",
      assignedCenterId: "center-1",
    });

    assert.equal(request.status, "in_progress");
    assert.deepEqual(notificationService.events, ["status_updated"]);
  });
});
