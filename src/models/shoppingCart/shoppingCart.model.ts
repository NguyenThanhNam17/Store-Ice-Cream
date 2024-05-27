import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import {
  OrderStatusEnum,
  ShoppingCartStatusEnum,
  paymentMethodEnum,
} from "../../constants/model.const";

// Định nghĩa type cho user
export type IShoppingCart = BaseDocument & {
  userId?: string;
  bookId?: string;
  quantity?: number;
  initialCost?: number;
  status?: string;
};

const shoppingCartSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    bookId: { type: Schema.Types.ObjectId, ref: "Book" },
    quantity: { type: Number },
    initialCost: { type: Number },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
      default: ShoppingCartStatusEnum.IN_CART,
    },
  },
  { timestamps: true }
  //virtual populate
);
shoppingCartSchema.set("toObject", { virtuals: true });
shoppingCartSchema.set("toJSON", { virtuals: true });
shoppingCartSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});
shoppingCartSchema.virtual("book", {
  ref: "Book",
  localField: "bookId",
  foreignField: "_id",
});
const ShoppingCartModel = mongoose.model<IShoppingCart>(
  "ShoppingCart",
  shoppingCartSchema
);

export { ShoppingCartModel };
