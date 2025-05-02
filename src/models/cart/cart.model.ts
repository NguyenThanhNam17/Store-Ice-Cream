import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

//định nghĩa type cho user

export type ICart = BaseDocument & {
  productId?: string;
  userId?: string;
  quantity?: number;
};

const cartSchema = new mongoose.Schema(
  {
    productId: { type: String },
    userId: { type: String },
    quantity: { type: Number },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export { CartModel };
