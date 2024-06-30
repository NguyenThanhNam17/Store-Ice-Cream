import { CounterModel } from "../counter/counter.model";
import { IOrder } from "./order.model";

export class OrderHelper {
  constructor(public order: IOrder) {}
  value() {
    return this.order;
  }
  static async generateOrderCode() {
    const orderCounter = await CounterModel.findOneAndUpdate(
      { name: "order" },
      { $setOnInsert: { value: 10000 } },
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
