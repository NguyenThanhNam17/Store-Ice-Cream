"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategoryModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var bookCategorySchema = new mongoose_1.default.Schema({
    name: { type: String },
    key: { type: String },
}, { timestamps: true });
var BookCategoryModel = mongoose_1.default.model("BookCategory", bookCategorySchema);
exports.BookCategoryModel = BookCategoryModel;
//# sourceMappingURL=bookCategory.model.js.map