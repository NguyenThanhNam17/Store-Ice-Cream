import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type ICounter = BaseDocument & {
  name?: string;
  value?: number;
};

const counterSchema = new mongoose.Schema(
  {
    name: { type: String },
    value: { type: Number },
  },
  { timestamps: true }
);

const CounterModel = mongoose.model<ICounter>("Counter", counterSchema);

export { CounterModel };
