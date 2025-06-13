import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";

import { ROLES } from "../../constants/role.const";
import { TokenHelper } from "../../helper/token.helper";
import { UserModel } from "../../models/user/user.model";
import { CartStatusEnum, OrderStatusEnum } from "../../constants/model.const";
import { OrderModel } from "../../models/order/order.model";
import { CartModel } from "../../models/cart/cart.model";
import { ProductModel } from "../../models/product/product.model";

class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post(
      "/createOrder",
      [this.route(this.authentication)],
      this.route(this.createOrder)
    );

    this.router.post(
      "/updateStatusOrder",
      [this.route(this.authentication)],
      this.route(this.updateStatusOrder)
    );

    this.router.get(
      "/getListOrder",
      [this.route(this.authentication)],
      this.route(this.getListOrder)
    );

    this.router.get("/getOneOrder/:id", [
      this.route(this.authentication),
      this.route(this.getOneOrder),
    ]);

    this.router.post("/cancelOrder", [
      this.route(this.authentication),
      this.route(this.cancelOrder),
    ]);
    
    this.router.post("/deleteOneOrder", [
      this.route(this.authentication),
      this.route(this.deleteOneOrder),
    ]);
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

    if (!carts) {
      throw ErrorHelper.forbidden("không tồn tại cart");
    }

    let totalPrice = 0;
    await Promise.all(
      carts.map(async (cart: any) => {
        const product = await ProductModel.findById(cart.productId);
        totalPrice += cart.quantity * product.price;
      })
    );

    let order = new OrderModel({
      userId: req.tokenInfo._id,
      cartIds: cartIds,
      paymentMethod: paymentMethod,
      status: OrderStatusEnum.PENDING,
      totalPrice: totalPrice,
    });

    await order.save();

    // Cập nhật trạng thái của các giỏ hàng đã dùng thành SUCCESS
    await CartModel.updateMany(
      { _id: { $in: cartIds } },
      { $set: { status: CartStatusEnum.SUCCESS } }
    );

    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }

  async getListOrder(req: Request, res: Response, next: NextFunction) {
    let list = await OrderModel.find({ userId: req.tokenInfo._id });
    if (!list) {
      throw ErrorHelper.requestDataInvalid("Khong co order");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        list,
      },
    });
  }

  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let result = await OrderModel.findById(id);
    if (!result) {
      throw ErrorHelper.requestDataInvalid("Khong co order");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "succes",
      data: {
        result,
      },
    });
  }

  async updateStatusOrder(req: Request, res: Response, next: NextFunction) {
    let { orderId, status } = req.body;

    if (!orderId || !status) {
      throw ErrorHelper.requestDataInvalid("Thiếu orderId hoặc status");
    }

    if (req.tokenInfo.role_ != ROLES.ADMIN) {
      throw ErrorHelper.permissionDeny();
    }

    let order = await OrderModel.findById(orderId);
    if (!order) {
      throw ErrorHelper.forbidden("Đơn hàng không tồn tại");
    }

    if (
      ![
        OrderStatusEnum.FAILED,
        OrderStatusEnum.PENDING,
        OrderStatusEnum.SUCCESS,
      ].includes(status)
    ) {
      throw ErrorHelper.requestDataInvalid("Trạng thái không hợp lệ");
    }
    order.status = status;
    await order.save();

    return res.status(200).json({
      status: 200,
      code: "200",
      message: "succes",
      data: {
        order,
      },
    });
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    let order: any = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Order");
    }

    order.status = OrderStatusEnum.FAILED;
    await order.save();

    return res.status(200).json({
      status: 200,
      code: "200",
      message: "succes",
      data: {
        order,
      },
    });
  }

  async deleteOneOrder(req: Request, res: Response, next: NextFunction) {
    let { id } = req.body;
    const order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("order");
    }

    await OrderModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "succes",
      data: {
        order,
      },
    });
  }
}

export default new OrderRoute().router;
