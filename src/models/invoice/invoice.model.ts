import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IInvoice = BaseDocument & {
  userId?: string;
  amount?: number;
  type?: string;
  orderId?: string;
  status?: string;
  walletId?: string;
};

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number },
    type: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    stauts: { type: String },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
  },
  { timestamps: true }
);

const InvoiceModel = mongoose.model<IInvoice>("Invoice", invoiceSchema);

export { InvoiceModel };
