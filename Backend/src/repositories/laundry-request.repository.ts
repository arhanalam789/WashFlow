import LaundryRequest, {
  type RequestStatus,
} from "../models/laundry-request.model";
import type { ILaundryRequestRepository } from "./interfaces/laundry-request-repository.interface";

const requestPopulate = [
  { path: "userId", select: "name email role" },
  { path: "washingCenterId", select: "centerName location operationStatus" },
];

interface CreateLaundryRequestInput {
  userId: string;
  washingCenterId?: string | null;
  clothesCount: number;
  preferredPickupDate: Date;
  status: RequestStatus;
}

export class LaundryRequestRepository implements ILaundryRequestRepository {
  async findById(id: string) {
    return LaundryRequest.findById(id);
  }

  async findByIdWithRelations(id: string) {
    return LaundryRequest.findById(id)
      .populate(requestPopulate[0])
      .populate(requestPopulate[1]);
  }

  async create(input: CreateLaundryRequestInput) {
    return LaundryRequest.create(input);
  }

  async listByRole(userId: string, role: string) {
    const query: Record<string, unknown> = {};

    if (role === "customer") {
      query.userId = userId;
    }

    if (role === "manager") {
      query.washingCenterId = { $ne: null };
    }

    return LaundryRequest.find(query)
      .sort({ createdAt: -1 })
      .populate(requestPopulate[0])
      .populate(requestPopulate[1]);
  }

  async save(request: InstanceType<typeof LaundryRequest>) {
    return request.save();
  }
}
