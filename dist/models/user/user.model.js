"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
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
}, { timestamps: true });
// Index for search
userSchema.index({ username: "text", name: "text" }, { weights: { username: 4, name: 2 } });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
var UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map