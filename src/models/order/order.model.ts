import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

export type IOrder = BaseDocument & {
  userId: string;
  cartId: string;
  price: number;
};

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<IOrder>("order", orderSchema);
export { OrderModel };
