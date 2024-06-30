import mongoose from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IUser = BaseDocument & {
  name?: string;
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
  role?: string;
  address?: string;
  gender?: string;
  key?: string;
  searchs?: string[];
  isBlock?: boolean;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    address: { type: String },
    role: { type: String },
    username: { type: String },
    password: { type: String },
    key: { type: String },
    searchs: [{ type: String }],
    isBlock: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Index for search
userSchema.index(
  { username: "text", name: "text" },
  { weights: { username: 4, name: 2 } }
);

userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.set("toObject", { virtuals: true });

userSchema.set("toJSON", { virtuals: true });
userSchema.virtual("wallet", {
  ref: "Wallet",
  localField: "walletId",
  foreignField: "_id",
});
const UserModel = mongoose.model<IUser>("User", userSchema);
export { UserModel };
