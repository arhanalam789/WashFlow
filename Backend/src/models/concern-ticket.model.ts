import { Schema, model, models, Types, type Model } from "mongoose";

export type ConcernType =
  | "missing_item"
  | "count_mismatch"
  | "delivery_issue"
  | "general_issue";

export interface ConcernTicketDocument {
  requestId: Types.ObjectId;
  raisedByManagerId: Types.ObjectId;
  type: ConcernType;
  expectedCount: number;
  receivedCount: number;
  note?: string;
  customerConfirmed: boolean;
  confirmedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const concernTicketSchema = new Schema<ConcernTicketDocument>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "LaundryRequest",
      required: true,
    },
    raisedByManagerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["missing_item", "count_mismatch", "delivery_issue", "general_issue"],
      required: true,
    },
    expectedCount: {
      type: Number,
      required: true,
      min: 0,
    },
    receivedCount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    customerConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ConcernTicket =
  (models.ConcernTicket as Model<ConcernTicketDocument>) ||
  model<ConcernTicketDocument>("ConcernTicket", concernTicketSchema);

export default ConcernTicket;
