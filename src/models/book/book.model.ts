import mongoose from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type IBook = BaseDocument & {
  name?: string;
  author?: string;
  category?: string;
  description?: string;
  quantity?: number;
  price?: number;
};

const bookSchema = new mongoose.Schema(
  {
    name: { type: String },
    author: { type: String },
    category: { type: String },
    description: { type: String },
    quantity: { type: Number },
    price: { type: Number },
  },
  { timestamps: true }
);
// Index for search
bookSchema.index(
  { name: "text", author: "text" },
  { weights: { name: 4, author: 2 } }
);

const BookModel = mongoose.model("Book", bookSchema);
export { BookModel };
