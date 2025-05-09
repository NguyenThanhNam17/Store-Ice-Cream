"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var paymentSchema = new mongoose_1.default.Schema({
    orderId: { type: String },
    userId: { type: String },
    amount: { type: Number },
    method: { type: String },
    status: { type: String },
    transactionId: { type: String },
    paidAt: { type: Date },
}, { timestamps: true });
var PaymentModel = mongoose_1.default.model("Payment", paymentSchema);
exports.PaymentModel = PaymentModel;
//# sourceMappingURL=payment.model.js.map