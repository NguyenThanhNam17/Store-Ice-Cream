"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var counterSchema = new mongoose_1.default.Schema({
    name: { type: String },
    value: { type: String },
}, { timestamps: true });
var CounterModel = mongoose_1.default.model("Counter", counterSchema);
exports.CounterModel = CounterModel;
//# sourceMappingURL=counter.model.js.map