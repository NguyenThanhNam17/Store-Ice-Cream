import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { CartStatusEnum } from "../../constants/model.const";

//định nghĩa type cho user

export type ICart = BaseDocument & {
  productId?: string;
  userId?: string;
  quantity?: number;
  status?:string;
};

const cartSchema = new mongoose.Schema(
  {
    productId: { type: String },
    userId: { type: String },
    quantity: { type: Number },
    status:{type:String, default:CartStatusEnum.PENDING},
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export { CartModel };
