"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var bookSchema = new mongoose_1.default.Schema({
    name: { type: String },
    author: { type: String },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "BookCategory" },
    description: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    images: [{ type: String }],
    isHighlight: { type: Boolean, default: false },
    soldQuantity: { type: Number, default: 0 },
    bookCategoryIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "BookCategory" }],
    slug: { type: String },
}, { timestamps: true });
// Index for search
bookSchema.index({ name: "text", author: "text" }, { weights: { name: 4, author: 2 } });
//virtual populate
bookSchema.set("toObject", { virtuals: true });
bookSchema.set("toJSON", { virtuals: true });
bookSchema.virtual("category", {
    ref: "BookCategory",
    localField: "categoryId",
    foreignField: "_id",
});
var BookModel = mongoose_1.default.model("Book", bookSchema);
exports.BookModel = BookModel;
//# sourceMappingURL=book.model.js.map