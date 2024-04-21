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
import { OrderStatusEnum } from "../../constants/model.const";
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
      "/getOneOrder/:id",
      [this.authentication],
      this.route(this.getOneOrder)
    );
    this.router.post(
      "/createOrder",
      [this.authentication],
      this.route(this.createOrder)
    );
    this.router.post(
      "/addBookToCart",
      [this.authentication],
      this.route(this.addBookToCart)
    );
    this.router.post(
      "/paymentOrderForCart",
      [this.authentication],
      this.route(this.paymentOrderForCart)
    );
    this.router.post(
      "/updateQuantityForOrder",
      [this.authentication],
      this.route(this.updateQuantityForOrder)
    );
    this.router.post(
      "/deleteOneOrder",
      [this.authentication],
      this.route(this.deleteOneOrder)
    );
  }
  //Auth
  async authentication(req: Request, res: Response, next: NextFunction) {
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
    var { limit, page, search, filter } = req.body;
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
      ["user", "book"]
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
    if (filter.status) {
      filter.status = { $nin: [OrderStatusEnum.IN_CART] };
    }
    const orders = await orderService.fetch(
      {
        filter: filter,
        search: search,
        limit: limit,
        page: page,
      },
      ["user", "book"]
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
    let { id } = req.params;
    const order = await OrderModel.findById(id)
      .populate("user")
      .populate("book");
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
  async addBookToCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    const { bookId, quantity } = req.body;
    if (!bookId || !quantity) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let book = await BookModel.findById(bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    if (book.quantity < quantity) {
      throw ErrorHelper.forbidden("Out of stock!");
    }
    let order = await OrderModel.findOne({
      userId: tokenData._id,
      bookId: bookId,
      status: OrderStatusEnum.IN_CART,
    });
    if (order) {
      order.quantity += quantity;
      order.initialCost += book.price * quantity;
      order.finalCost += book.price * quantity;
      await order.save();
    } else {
      order = new OrderModel({
        bookId: bookId,
        quantity: quantity,
        initialCost: book.price * quantity,
        discountAmount: 0,
        finalCost: book.price * quantity + 30000,
        userId: tokenData._id,
        shippingFee: 30000,
      });
      await order.save();
    }
    await bookService.updateOne(book._id, {
      $inc: {
        quantity: -quantity,
      },
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  async paymentOrderForCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    const { orderId, address, note, phoneNumber } = req.body;
    if (!orderId || !phoneNumber || !address) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let order = await OrderModel.findById(orderId);
    if (!order) {
      throw ErrorHelper.recoredNotFound("order!");
    }
    if (tokenData._id != order.userId) {
      throw ErrorHelper.somethingWentWrong();
    }
    order.note = note;
    order.phone = phoneNumber;
    order.status = OrderStatusEnum.PENDING;
    order.isPaid = true;
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

  async createOrder(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    const { bookId, quantity, address, note, phoneNumber, paymentMethod } =
      req.body;
    if (!bookId || !quantity || !address || !phoneNumber) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let book = await BookModel.findById(bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    if (book.quantity < quantity) {
      throw ErrorHelper.forbidden("Out of stock!");
    }
    const order = new OrderModel({
      bookId: bookId,
      quantity: quantity,
      address: address,
      note: note || "",
      initialCost: book.price * quantity,
      discountAmount: 0,
      finalCost: book.price * quantity + 30000,
      userId: tokenData._id,
      phone: phoneNumber,
      paymentMethod: paymentMethod,
      isPaid: true,
      shippingFee: 30000,
    });
    await order.save();
    await bookService.updateOne(book._id, {
      $inc: {
        quantity: -quantity,
      },
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        order,
      },
    });
  }
  async updateQuantityForOrder(req: Request, res: Response) {
    const { orderId, isIncrease } = req.body;
    let quantity = 1;

    let order: any = await OrderModel.findById(orderId);
    if (!order) {
      throw ErrorHelper.recoredNotFound("order!");
    }
    let book = await BookModel.findById(order.bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    if (isIncrease == false) {
      quantity = -1;
      if (order.quantity == 1) {
        await OrderModel.deleteOne(order._id);
      }
    }
    await orderService.updateOne(order._id, {
      $inc: {
        quantity: quantity,
      },
      initialCost:
        quantity == -1
          ? order.initialCost - book.price
          : order.initialCost + book.price,
      finalCost:
        quantity == -1
          ? order.initialCost - book.price
          : order.initialCost + book.price,
    });

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
    const { id, bookId, quantity, address, note, status, phoneNumber } =
      req.body;
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Book");
    }
    let book = await BookModel.findById(order.bookId);
    let initialCost, finalCost;
    if (bookId != order.bookId || quantity != order.quantity) {
      initialCost = book.price * quantity;
      finalCost = book.price * quantity;
    }
    await orderService.updateOne(order._id, {
      bookId: bookId,
      quantity: quantity,
      address: address,
      note: note,
      status: status,
      phone: phoneNumber,
      initialCost: initialCost,
      finalCost: finalCost,
    });
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
    let order = await OrderModel.findById(id);
    if (!order) {
      throw ErrorHelper.recoredNotFound("Book");
    }
    order.status = status;
    order.save();
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
