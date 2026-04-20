import { Schema, model, models, Types, type Model } from "mongoose";

export type RequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "concern_raised";

export interface LaundryRequestDocument {
  userId: Types.ObjectId;
  washingCenterId?: Types.ObjectId | null;
  clothesCount: number;
  preferredPickupDate: Date;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const laundryRequestSchema = new Schema<LaundryRequestDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    washingCenterId: {
      type: Schema.Types.ObjectId,
      ref: "WashingCenter",
      default: null,
    },
    clothesCount: {
      type: Number,
      required: true,
      min: 1,
    },
    preferredPickupDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed", "concern_raised"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const LaundryRequest =
  (models.LaundryRequest as Model<LaundryRequestDocument>) ||
  model<LaundryRequestDocument>("LaundryRequest", laundryRequestSchema);

export default LaundryRequest;
