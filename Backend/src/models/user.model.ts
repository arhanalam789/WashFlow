import { Schema, model, models, Types } from "mongoose";

export type UserRole = "customer" | "manager" | "admin";

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  assignedCenterId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "manager", "admin"],
      default: "customer",
    },
    assignedCenterId: {
      type: Schema.Types.ObjectId,
      ref: "WashingCenter",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<UserDocument>("User", userSchema);

export default User;
