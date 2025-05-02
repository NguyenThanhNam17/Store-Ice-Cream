"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var productSchema = new mongoose_1.default.Schema({
    name: { type: String },
    price: { type: Number, default: 0 },
    image: { type: String },
    describe: { type: String },
}, { timestamps: true });
// Index for search
var ProductModel = mongoose_1.default.model("Product", productSchema);
exports.ProductModel = ProductModel;
//# sourceMappingURL=product.model.js.map