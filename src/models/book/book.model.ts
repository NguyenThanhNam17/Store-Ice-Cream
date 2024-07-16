import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IBook = BaseDocument & {
  name?: string;
  author?: string;
  categoryId?: string;
  description?: string;
  quantity?: number;
  price?: number;
  images?: string[];
  isHighlight?: boolean;
  soldQuantity?: number;
  bookCategoryIds?: string[];
  slug?: string;
};

const bookSchema = new mongoose.Schema(
  {
    name: { type: String },
    author: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "BookCategory" },
    description: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    images: [{ type: String }],
    isHighlight: { type: Boolean, default: false },
    soldQuantity: { type: Number, default: 0 },
    bookCategoryIds: [{ type: Schema.Types.ObjectId, ref: "BookCategory" }],
    slug: { type: String },
  },
  { timestamps: true }
);
// Index for search
bookSchema.index(
  { name: "text", author: "text" },
  { weights: { name: 4, author: 2 } }
);
//virtual populate
bookSchema.set("toObject", { virtuals: true });
bookSchema.set("toJSON", { virtuals: true });
bookSchema.virtual("category", {
  ref: "BookCategory",
  localField: "categoryId",
  foreignField: "_id",
});
const BookModel = mongoose.model<IBook>("Book", bookSchema);
export { BookModel };
