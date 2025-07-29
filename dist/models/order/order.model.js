"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var model_const_1 = require("../../constants/model.const");
var orderSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    cartIds: [{ type: String }],
    price: { type: Number },
    paymentMethod: { type: String },
    status: {
        type: String,
        enum: Object.values(model_const_1.OrderStatusEnum),
    },
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean }
}, {
    timestamps: true,
});
var OrderModel = mongoose_1.default.model("order", orderSchema);
exports.OrderModel = OrderModel;
//# sourceMappingURL=order.model.js.map