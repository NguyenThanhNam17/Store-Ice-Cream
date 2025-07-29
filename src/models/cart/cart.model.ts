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
    productId: { type: Schema.Types.ObjectId,ref:"Product" },
    userId: { type: Schema.Types.ObjectId,ref:"User" },
    quantity: { type: Number },
    status:{type:String, default:CartStatusEnum.PENDING},
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", cartSchema);
export { CartModel };
