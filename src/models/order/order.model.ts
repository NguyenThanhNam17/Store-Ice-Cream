import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
<<<<<<< HEAD
import {
  OrderStatusEnum,
  paymentMethodEnum,
} from "../../constants/model.const";
=======
import { OrderStatusEnum } from "../../constants/model.const";
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6

// Định nghĩa type cho user
export type IOrder = BaseDocument & {
  userId?: string;
  bookId?: string;
  quantity?: number;
  initialCost?: string;
  discountAmount?: string;
  finalCost?: string;
  status?: string;
  note?: string;
  address?: string;
<<<<<<< HEAD
  phone?: string;
  isPaid?: boolean;
  paymentMethod?: string;
=======
  isPaid?: boolean;
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
};

const orderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    bookId: { type: Schema.Types.ObjectId, ref: "Book" },
    quantity: { type: Number },
    initialCost: { type: Number },
    discountAmount: { type: String },
    finalCost: { type: Number },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
<<<<<<< HEAD
      default: OrderStatusEnum.IN_CART,
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
=======
      default: OrderStatusEnum.PENDING,
    },
    note: { type: String },
    address: { type: String },
    isPaid: { type: Boolean, default: false },
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
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
orderSchema.virtual("book", {
  ref: "Book",
  localField: "bookId",
  foreignField: "_id",
});
const OrderModel = mongoose.model<IOrder>("Order", orderSchema);

export { OrderModel };
