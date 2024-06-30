import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IWallet = BaseDocument & {
  userId?: string;
  balance?: number;
};

const walletSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number },
  },
  { timestamps: true }
);
walletSchema.set("toObject", { virtuals: true });
walletSchema.set("toJSON", { virtuals: true });
walletSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});
const WalletModel = mongoose.model<IWallet>("Wallet", walletSchema);

export { WalletModel };
