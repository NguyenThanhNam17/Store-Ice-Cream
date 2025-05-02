import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { ProductModel } from "../../models/product/product.model";

class ProductRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.get("/getAllProduct", this.route(this.getAllProduct));
    this.router.get(
      "/getOneProduct/:idProduct",
      this.route(this.getOneProduct)
    );
  }

  async getAllProduct(req: Request, res: Response) {
    let products = await ProductModel.find({});
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        products,
      },
    });
  }

  async getOneProduct(req: Request, res: Response) {
    let { idProduct } = req.params;
    let product = await ProductModel.findById(idProduct);

    if (!product) {
      throw ErrorHelper.recoredNotFound("product");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        product,
      },
    });
  }
}

export default new ProductRoute().router;
