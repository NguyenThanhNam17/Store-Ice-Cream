import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IProduct = BaseDocument & {
  name?: string;
  price?: number;
  image?: string;
  describe?: string;
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number, default: 0 },
    image: { type: String },
    describe: { type: String },
  },
  { timestamps: true }
);
// Index for search
const ProductModel = mongoose.model<IProduct>("Product", productSchema);
export { ProductModel };
