"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var orderSchema = new mongoose_1.default.Schema({
    userId: String,
    cartId: String,
    price: Number,
}, {
    timestamps: true,
});
var OrderModel = mongoose_1.default.model("order", orderSchema);
exports.OrderModel = OrderModel;
//# sourceMappingURL=order.model.js.map