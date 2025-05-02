import { CrudService } from "../../base/crudService";
import { OrderModel } from "../order/order.model";

class OrderService extends CrudService<typeof OrderModel> {
  constructor() {
    super(OrderModel);
  }
}

const orderService = new OrderService();
export { orderService };
