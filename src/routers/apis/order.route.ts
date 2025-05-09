import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { TransactionModel } from "../../models/transaction/transaction.model";
import { ROLES } from "../../constants/role.const";
import { TokenHelper } from "../../helper/token.helper";
import { UserModel } from "../../models/user/user.model";
import { OrderStatusEnum } from "../../constants/model.const";
import { OrderModel } from "../../models/order/order.model";
import { CartModel } from "../../models/cart/cart.model";
import { ProductModel } from "../../models/product/product.model";

class TransactionRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post(
      "/createOrder",
      [this.route(this.authentication)],
      this.route(this.createOrder)
    );
  }

  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.get("x-token")) {
        throw ErrorHelper.unauthorized();
      }
      const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
      if ([ROLES.ADMIN, ROLES.CLIENT].includes(tokenData.role_)) {
        const user: any = await UserModel.findById(tokenData._id);
        if (!user) {
          throw ErrorHelper.userNotExist();
        }
        req.tokenInfo = tokenData;
        next();
      } else {
        throw ErrorHelper.permissionDeny();
      }
    } catch {
      throw ErrorHelper.unauthorized();
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    var { cartIds, paymentMethod } = req.body;
    if (cartIds.length == 0 || !paymentMethod) {
      throw ErrorHelper.requestDataInvalid("invalid data");
    }

    var carts = await CartModel.find({ _id: { $in: cartIds } });
    let totalPrice = 0;
    await Promise.all(
      carts.map(async (cart: any) => {
        const product = await ProductModel.findById(cart.productId);
        totalPrice += cart.quantity * product.price;
      })
    );

    console.log(totalPrice);
    let order = new OrderModel({
      userId: req.tokenInfo._id,
      cartIds: cartIds,
      paymentMethod: paymentMethod,
      status: OrderStatusEnum.PENDING,
      totalPrice: totalPrice,
    });

    await order.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
}

export default new TransactionRoute().router;
