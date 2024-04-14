"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var bookSchema = new mongoose_1.default.Schema({
    name: { type: String },
    author: { type: String },
    category: { type: String },
    description: { type: String },
    quantity: { type: Number },
    price: { type: Number },
}, { timestamps: true });
// Index for search
bookSchema.index({ name: "text", author: "text" }, { weights: { name: 4, author: 2 } });
var BookModel = mongoose_1.default.model("Book", bookSchema);
exports.BookModel = BookModel;
//# sourceMappingURL=book.model.js.map