import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { OrderStatusEnum } from "../../constants/model.const";

export type IOrder = BaseDocument & {
  userId?: string;
  cartIds?: string[];
  price?: number;
  paymentMethod?: string;
  status?: string;
  totalPrice?: number;
};

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    cartIds: [{ type: String }],
    price: { type: Number },
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
    },
    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<IOrder>("order", orderSchema);
export { OrderModel };
