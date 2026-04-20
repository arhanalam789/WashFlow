import { Schema, model, models } from "mongoose";

export type UserRole = "customer" | "manager" | "admin";

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
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
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<UserDocument>("User", userSchema);

export default User;
