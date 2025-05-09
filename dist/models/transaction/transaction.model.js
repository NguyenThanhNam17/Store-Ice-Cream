"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var model_const_1 = require("../../constants/model.const");
var transactionSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    orderId: { type: String },
    status: {
        type: String,
        enum: Object.values(model_const_1.TransStatusEnum),
        default: model_const_1.TransStatusEnum.PENDING,
    },
    amount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });
// Index for search
var TransactionModel = mongoose_1.default.model("Transaction", transactionSchema);
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=transaction.model.js.map