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
exports.UserModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    address: { type: String },
    role: { type: String },
    username: { type: String },
    password: { type: String },
    key: { type: String },
    searchs: [{ type: String }],
    categoryIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "BookCategory" }],
    isBlock: { type: Boolean, default: false },
    walletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
}, { timestamps: true });
// Index for search
userSchema.index({ username: "text", name: "text", phone: "text" }, { weights: { phone: 6, name: 4, username: 2 } });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
userSchema.virtual("wallet", {
    ref: "Wallet",
    localField: "walletId",
    foreignField: "_id",
});
var UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map