import { CrudService } from "../../base/crudService";
import { CartModel } from "./cart.model";

class CartService extends CrudService<typeof CartModel> {
  constructor() {
    super(CartModel);
  }
}

const cartService = new CartService();
export { cartService };
