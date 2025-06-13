"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var model_const_1 = require("../../constants/model.const");
var cartSchema = new mongoose_1.default.Schema({
    productId: { type: String },
    userId: { type: String },
    quantity: { type: Number },
    status: { type: String, default: model_const_1.CartStatusEnum.PENDING },
}, { timestamps: true });
var CartModel = mongoose_1.default.model("Cart", cartSchema);
exports.CartModel = CartModel;
//# sourceMappingURL=cart.model.js.map