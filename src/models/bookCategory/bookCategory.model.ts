import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IBookCategory = BaseDocument & {
  name?: string;
  key?: string;
};

const bookCategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    key: { type: String },
  },
  { timestamps: true }
);

const BookCategoryModel = mongoose.model<IBookCategory>(
  "BookCategory",
  bookCategorySchema
);

export { BookCategoryModel };
