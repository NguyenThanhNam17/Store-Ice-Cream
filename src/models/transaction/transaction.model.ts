import mongoose from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { TransStatusEnum } from "../../constants/model.const";

// Định nghĩa type cho user
export type ITransaction = BaseDocument & {
  userId: string;
  orderId: string;
  status: string;
  amount: number;
  isPaid?: boolean;
};

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: String },
    orderId: { type: String },
    status: {
      type: String,
      enum: Object.values(TransStatusEnum),
      default: TransStatusEnum.PENDING,
    },
    amount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Index for search
const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
export { TransactionModel };
