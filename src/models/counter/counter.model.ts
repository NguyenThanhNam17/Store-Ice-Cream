import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";

// Định nghĩa type cho user
export type ICounter = BaseDocument & {
  name?: string;
  value?: string;
};

const counterSchema = new mongoose.Schema(
  {
    name: { type: String },
    value: { type: String },
  },
  { timestamps: true }
);

const CounterModel = mongoose.model<ICounter>("Counter", counterSchema);

export { CounterModel };
