import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";

import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
import { BookModel } from "../../models/book/book.model";
import _ from "lodash";
import { bookService } from "../../models/book/book.service";
import { orderService } from "../..//models/order/order.service";
import { OrderModel } from "../../models/order/order.model";
import {
  OrderStatusEnum,
  ShoppingCartStatusEnum,
} from "../../constants/model.const";
import { ShoppingCartModel } from "../../models/shoppingCart/shoppingCart.model";
import { userService } from "../../models/user/user.service";
import { UtilsHelper } from "../../helper/utils.helper";
import phone from "phone";
class OrderRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post(
      "/getAllOrder",
      [this.authentication],
      this.route(this.getAllOrder)
    );
    this.router.post(
      "/getAllOrderForAdmin",
      [this.authentication],
      this.route(this.getAllOrderForAdmin)
    );
    this.router.post(
      "/updateOrderForAdmin",
      [this.authentication],
      this.route(this.updateOrderForAdmin)
    );
    this.router.post(
      "/updateStatusOrder",
      [this.authentication],
      this.route(this.updateStatusOrder)
    );

    this.router.post(
      "/getOneOrder",
      [this.authentication],
      this.route(this.getOneOrder)
    );
    this.router.post(
      "/getBill",
      [this.authentication],
      this.route(this.getBill)
    );
    this.router.post(
      "/createOrder",
      [this.authentication],
      this.route(this.createOrder)
    );
    this.router.post(
      "/deleteOneOrder",
      [this.authentication],
      this.route(this.deleteOneOrder)
    );
    this.router.post(
      "/cancelOrder",
      [this.authentication],
      this.route(this.cancelOrder)
    );
  }
  //Auth
  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.get("x-token")) {
        throw ErrorHelper.unauthorized();
      }
      const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
      if ([ROLES.ADMIN, ROLES.CLIENT, ROLES.STAFF].includes(tokenData.role_)) {
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
      throw ErrorHelper.userWasOut();
    }
  }
  //getAllOrder
  async getAllOrder(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    try {
      req.body.limit = parseInt(req.body.limit);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("limit");
    }
    try {
      req.body.page = parseInt(req.body.page);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("page");
    }
    var { limit, page, search } = req.body;
    let filter = req?.body || {};
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    if (tokenData.role_ != ROLES.ADMIN) {
      filter.userId = tokenData._id;
    }
    const orders = await orderService.fetch(
      {
        filter: filter,
        search: search,
        limit: limit,
        page: page,
      },
      [`user`, "shoppingCarts"]
    );
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: orders,
    });
  }
  //getAllOrderForAdmin
  async getAllOrderForAdmin(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (tokenData.role_ != ROLES.ADMIN) {
      throw ErrorHelper.permissionDeny();
    }
    try {
      req.body.limit = parseInt(req.body.limit);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("limit");
    }
    try {
      req.body.page = parseInt(req.body.page);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("page");
    }
    var { limit, page, search, filter } = req.body;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    // if (filter.status) {
    //   filter.status = { $nin: [OrderStatusEnum.IN_CART] };
    // }
    const orders = await orderService.fetch(
      {
        filter: filter,
        search: search,
        limit: limit,
        page: page,
      },
      ["user", "shoppingCarts"]
    );
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: orders,
    });
  }

  //getOneOrder
  async getOneOrder(req: Request, res: Response) {
    let { id } = req.body;
    const order = await OrderModel.findById(id)
      .populate("user")
      .populate({
        path: "shoppingCarts",
        populate: {
          path: "book",
        },
      });
    if (!order) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.recoredNotFound("order!");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  //get bill
  async getBill(req: Request, res: Response) {
    let { shoppingCartIds } = req.body;
    const shoppingCarts = await ShoppingCartModel.find({
      _id: { $in: shoppingCartIds },
    });
    let initialCost = 0;
    if (shoppingCarts.length < 1) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.recoredNotFound("shoppingCart!");
    }
    shoppingCarts.map((shoppingCart) => {
      initialCost += shoppingCart.initialCost;
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        initialCost: initialCost,
        shippingFee: 30000,
        finalCost: initialCost + 30000,
      },
    });
  }

  async createOrder(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    const { bookId, quantity, address, note, phoneNumber } = req.body;
    if (!bookId || !quantity || !address || !phoneNumber) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let book = await BookModel.findById(bookId);
    if (book) {
      throw ErrorHelper.recoredNotFound("order!");
    }
    var newPhone = UtilsHelper.parsePhone(phoneNumber, "+84");
    let phoneCheck = phone(newPhone);
    if (!phoneCheck.isValid) {
      throw ErrorHelper.requestDataInvalid("phone");
    }
    let initialCost = book.price * quantity;
    let shoppingCart = new ShoppingCartModel({
      bookId: book._id,
      bookName: book.name,
      quantity: quantity,
      initialCost: initialCost,
      status: ShoppingCartStatusEnum.SUCCESS,
    });
    await shoppingCart.save();
    const order = new OrderModel({
      shoppingCartIds: [shoppingCart._id],
      quantity: quantity,
      address: address,
      note: note || "",
      initialCost: initialCost,
      discountAmount: 0,
      finalCost: initialCost + 30000,
      userId: tokenData._id,
      phone: newPhone,
      isPaid: true,
      shippingFee: 30000,
    });
    await order.save();
    await Promise.all([
      UserModel.updateOne(
        { _id: order.userId },
        {
          $addToSet: {
            searchs: {
              $each: book.categoryId,
            },
          },
        }
      ),
      //limit array size
      UserModel.updateOne(
        { _id: order.userId },
        {
          $push: {
            searchs: {
              $each: [],
              $slice: -10,
            },
          },
        }
      ),
    ]);
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  //update order for admin
  async updateOrderForAdmin(req: Request, res: Response) {
    const { id, address, note, status, phoneNumber, noteUpdate } = req.body;
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (!tokenData) {
      throw ErrorHelper.unauthorized();
    }
    if (tokenData.role_ != ROLES.ADMIN) {
      throw ErrorHelper.permissionDeny();
    }
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Book");
    }
    if (OrderStatusEnum.CANCEL == order.status) {
      throw ErrorHelper.forbidden("The order is canceled!");
    } else {
      if (OrderStatusEnum.SUCCESS == order.status) {
        throw ErrorHelper.forbidden("The order is success!");
      }
    }
    var newPhone = UtilsHelper.parsePhone(phoneNumber, "+84");
    let phoneCheck = phone(newPhone);
    if (!phoneCheck.isValid) {
      throw ErrorHelper.requestDataInvalid("phone");
    }
    await orderService.updateOne(order._id, {
      address: address || order.address,
      note: note || order.note,
      status: status || order.status,
      phone: newPhone || order.phone,
      noteUpdate: noteUpdate || order.noteUpdate,
    });
    if (status == OrderStatusEnum.CANCEL) {
      let shoppingCarts = await ShoppingCartModel.find({
        _id: order.shoppingCartIds,
      });
      shoppingCarts.map(async (shoppingCart: any) => {
        await bookService.updateOne(shoppingCart.bookId, {
          $inc: {
            quantity: shoppingCart.quantity,
          },
        });
      });
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  //update status order for admin
  async updateStatusOrder(req: Request, res: Response) {
    const { id, status } = req.body;
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (!tokenData) {
      throw ErrorHelper.unauthorized();
    }
    if (tokenData.role_ != ROLES.ADMIN) {
      throw ErrorHelper.permissionDeny();
    }
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("order");
    }
    order.status = status;
    order.save();
    if (status == OrderStatusEnum.CANCEL) {
      let shoppingCarts = await ShoppingCartModel.find({
        _id: order.shoppingCartIds,
      });
      shoppingCarts.map(async (shoppingCart: any) => {
        await bookService.updateOne(shoppingCart.bookId, {
          $inc: {
            quantity: shoppingCart.quantity,
          },
        });
      });
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  //cancel order
  async cancelOrder(req: Request, res: Response) {
    const { id } = req.body;
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Book!");
    }
    order.status = OrderStatusEnum.CANCEL;
    let shoppingCarts = await ShoppingCartModel.find({
      _id: order.shoppingCartIds,
    });
    shoppingCarts.map(async (shoppingCart: any) => {
      await bookService.updateOne(shoppingCart.bookId, {
        $inc: {
          quantity: shoppingCart.quantity,
        },
      });
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

  async deleteOneOrder(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id } = req.body;
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Book!");
    }
    await OrderModel.deleteOne({ _id: id });
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
export default new OrderRoute().router;
