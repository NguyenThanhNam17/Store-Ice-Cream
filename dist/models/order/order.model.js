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
exports.OrderModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var model_const_1 = require("../../constants/model.const");
var orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    bookId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book" },
    quantity: { type: Number },
    initialCost: { type: Number },
    discountAmount: { type: String },
    finalCost: { type: Number },
    status: {
        type: String,
        enum: Object.values(model_const_1.OrderStatusEnum),
<<<<<<< HEAD
        default: model_const_1.OrderStatusEnum.IN_CART,
=======
        default: model_const_1.OrderStatusEnum.PENDING,
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
    },
    note: { type: String },
    address: { type: String },
    isPaid: { type: Boolean, default: false },
<<<<<<< HEAD
    paymentMethod: {
        type: String,
        enum: Object.values(model_const_1.paymentMethodEnum),
        default: model_const_1.paymentMethodEnum.CASH,
    },
=======
>>>>>>> 55f1703fb6b37d0fe0bdd90008ef46ca7fecbac6
}, { timestamps: true }
//virtual populate
);
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });
orderSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
});
orderSchema.virtual("book", {
    ref: "Book",
    localField: "bookId",
    foreignField: "_id",
});
var OrderModel = mongoose_1.default.model("Order", orderSchema);
exports.OrderModel = OrderModel;
//# sourceMappingURL=order.model.js.map