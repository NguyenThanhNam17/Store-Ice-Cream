import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  paymentMethodEnum,
} from "../../constants/model.const";

// Định nghĩa type cho user
export type IOrder = BaseDocument & {
  code?: string;
  userId?: string;
  shoppingCartIds?: string[];
  quantity?: number;
  initialCost?: number;
  discountAmount?: string;
  shippingFee?: number;
  finalCost?: number;
  status?: string;
  note?: string;
  address?: string;
  phone?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  noteUpdate?: string;
  paymentStatus?: String;
};

const orderSchema = new mongoose.Schema(
  {
    code: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    shoppingCartIds: [{ type: Schema.Types.ObjectId, ref: "ShoppingCart" }],
    quantity: { type: Number },
    initialCost: { type: Number },
    discountAmount: { type: String },
    shippingFee: { type: Number },
    finalCost: { type: Number },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.PENDING,
    },
    note: { type: String },
    address: { type: String },
    phone: { type: String },
    isPaid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethodEnum),
      default: paymentMethodEnum.CASH,
    },
    noteUpdate: { type: String },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatusEnum),
      default: PaymentStatusEnum.SUCCESS,
    },
  },
  { timestamps: true }
  //virtual populate
);
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });
orderSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});
orderSchema.virtual("shoppingCarts", {
  ref: "ShoppingCart",
  localField: "shoppingCartIds",
  foreignField: "_id",
});
const OrderModel = mongoose.model<IOrder>("Order", orderSchema);

export { OrderModel };
