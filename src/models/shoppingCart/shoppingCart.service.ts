import { CrudService } from "../../base/crudService";
import { ShoppingCartModel } from "./shoppingCart.model";

class ShoppingCartService extends CrudService<typeof ShoppingCartModel> {
  constructor() {
    super(ShoppingCartModel);
  }
}

const shoppingCartService = new ShoppingCartService();

export { shoppingCartService };
