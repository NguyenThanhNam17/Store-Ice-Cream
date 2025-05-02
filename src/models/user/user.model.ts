import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IUser = BaseDocument & {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: string;
  key?: string;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
    key: { type: String },
  },
  { timestamps: true }
);
// Index for search
const UserModel = mongoose.model<IUser>("User", userSchema);
export { UserModel };
