import ConcernTicket from "../models/concern-ticket.model";
import LaundryRequest from "../models/laundry-request.model";
import type { IConcernTicketRepository } from "./interfaces/concern-ticket-repository.interface";

export class ConcernTicketRepository implements IConcernTicketRepository {
  async findById(id: string) {
    return ConcernTicket.findById(id);
  }

  async findByIdWithRelations(id: string) {
    return ConcernTicket.findById(id)
      .populate({
        path: "requestId",
        populate: [
          { path: "userId", select: "name email role" },
          { path: "washingCenterId", select: "centerName location operationStatus" },
        ],
      })
      .populate("raisedByManagerId", "name email role");
  }

  async listByRole(userId: string, role: string) {
    if (role === "customer") {
      const requests = await LaundryRequest.find({ userId }).select("_id");
      const requestIds = requests.map((request) => request._id);

      return ConcernTicket.find({ requestId: { $in: requestIds } })
        .sort({ createdAt: -1 })
        .populate({
          path: "requestId",
          populate: [
            { path: "userId", select: "name email role" },
            { path: "washingCenterId", select: "centerName location operationStatus" },
          ],
        })
        .populate("raisedByManagerId", "name email role");
    }

    return ConcernTicket.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "requestId",
        populate: [
          { path: "userId", select: "name email role" },
          { path: "washingCenterId", select: "centerName location operationStatus" },
        ],
      })
      .populate("raisedByManagerId", "name email role");
  }

  async create(input: {
    requestId: string;
    raisedByManagerId: string;
    type: string;
    expectedCount: number;
    receivedCount: number;
    note: string;
  }) {
    return ConcernTicket.create(input);
  }

  async save(concern: InstanceType<typeof ConcernTicket>) {
    return concern.save();
  }
}
