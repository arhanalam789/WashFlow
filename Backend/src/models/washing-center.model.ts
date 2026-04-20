import { Schema, model, models, type Model } from "mongoose";

export interface WashingCenterDocument {
  centerName: string;
  location: string;
  contactPhone: string;
  operationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const washingCenterSchema = new Schema<WashingCenterDocument>(
  {
    centerName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    operationStatus: {
      type: String,
      required: true,
      default: "active",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const WashingCenter =
  (models.WashingCenter as Model<WashingCenterDocument>) ||
  model<WashingCenterDocument>("WashingCenter", washingCenterSchema);

export default WashingCenter;
