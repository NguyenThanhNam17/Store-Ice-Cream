import { CounterModel } from "../counter/counter.model";
import { IOrder } from "./order.model";

export class OrderHelper {
  constructor(public order: IOrder) {}
  value() {
    return this.order;
  }
  static async generateOrderCode() {
    const orderCounter = await CounterModel.findOneAndUpdate(
      { name: "trip" },
      { $setOnInsert: { value: 2000000000 } },
      { upsert: true, new: true }
    );
    return orderCounter
      .updateOne({ $inc: { value: 1 } })
      .exec()
      .then(() => {
        return `BS${orderCounter.value + 1}`;
      });
  }
}
