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
import { OrderModel } from "../../models/order/order.model";
import {
  OrderStatusEnum,
  ShoppingCartStatusEnum,
} from "../../constants/model.const";
import { shoppingCartService } from "../../models/shoppingCart/shoppingCart.service";
import { ShoppingCartModel } from "../../models/shoppingCart/shoppingCart.model";
class ShoppingCartRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post(
      "/getAllShoppingCart",
      [this.authentication],
      this.route(this.getAllShoppingCart)
    );
    this.router.post(
      "/getOneShoppingCart/:id",
      // [this.authentication],
      this.route(this.getOneShoppingCart)
    );
    this.router.post(
      "/addBookToCart",
      // [this.authentication],
      this.route(this.addBookToCart)
    );
    this.router.post(
      "/paymentShoppingCart",
      // [this.authentication],
      this.route(this.paymentShoppingCart)
    );
    this.router.post(
      "/updateQuantityBookInCart",
      // [this.authentication],
      this.route(this.updateQuantityBookInCart)
    );
  }
  //Auth
  async authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.get("x-token")) {
      throw ErrorHelper.unauthorized();
    }
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if ([ROLES.ADMIN].includes(tokenData.role_)) {
      const user = await UserModel.findById(tokenData._id);
      if (!user) {
        throw ErrorHelper.userNotExist();
      }
      req.tokenInfo = tokenData;
      next();
    } else {
      throw ErrorHelper.permissionDeny();
    }
  }
  //getAllShoppingCart
  async getAllShoppingCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
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
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    let filter: any = {
      status: ShoppingCartStatusEnum.IN_CART,
      userId: tokenData._id,
    };
    const shoppingCarts = await shoppingCartService.fetch(
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
      data: shoppingCarts,
    });
  }

  //getOneShoppingCart
  async getOneShoppingCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (tokenData) {
      throw ErrorHelper.unauthorized();
    }
    let { id } = req.params;
    const shoppingCart = await ShoppingCartModel.findById(id)
      .populate("user")
      .populate("book");
    if (!shoppingCart) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.recoredNotFound("order!");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        shoppingCart,
      },
    });
  }

  async addBookToCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (tokenData) {
      throw ErrorHelper.unauthorized();
    }
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
    let shoppingCart = await ShoppingCartModel.findOne({
      userId: tokenData._id,
      bookId: bookId,
      status: ShoppingCartStatusEnum.IN_CART,
    });
    if (shoppingCart) {
      shoppingCart.quantity += quantity;
      shoppingCart.initialCost += book.price * quantity;
      await shoppingCart.save();
    } else {
      shoppingCart = new ShoppingCartModel({
        bookId: bookId,
        quantity: quantity,
        initialCost: book.price * quantity,
        userId: tokenData._id,
      });
      await shoppingCart.save();
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
        shoppingCart,
      },
    });
  }
  async paymentShoppingCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (tokenData) {
      throw ErrorHelper.unauthorized();
    }
    const { shoppingCartIds, address, note, phoneNumber } = req.body;
    if (
      !shoppingCartIds ||
      shoppingCartIds.length < 1 ||
      !phoneNumber ||
      !address
    ) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let shoppingCarts = await ShoppingCartModel.find({
      _id: { $in: shoppingCartIds },
    });
    if (shoppingCarts.length < 1) {
      throw ErrorHelper.recoredNotFound("order!");
    }
    let initialCost = 0;
    shoppingCarts.map(async (shoppingCart) => {
      initialCost += shoppingCart.initialCost;
      shoppingCart.status = ShoppingCartStatusEnum.SUCCESS;
    });
    let order = new OrderModel({
      userId: tokenData._id,
      shoppingCartIds: shoppingCartIds,
      phone: phoneNumber,
      address: address,
      note: note,
      status: OrderStatusEnum.PENDING,
      isPaid: true,
      shippingFee: 30000,
      initialCost: initialCost,
      finalCost: initialCost + 30000,
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

  async updateQuantityBookInCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (tokenData) {
      throw ErrorHelper.unauthorized();
    }
    const { shoppingCartId, isIncrease } = req.body;
    let quantity = 1;

    let shoppingCart = await ShoppingCartModel.findById(shoppingCartId);
    if (!shoppingCart) {
      throw ErrorHelper.recoredNotFound("shoppingCart!");
    }
    let book = await BookModel.findById(shoppingCart.bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    if (isIncrease == false) {
      quantity = -1;
      if (shoppingCart.quantity == 1) {
        await ShoppingCartModel.deleteOne(shoppingCart._id);
      }
      book.quantity += 1;
    } else {
      book.quantity -= 1;
    }
    await shoppingCartService.updateOne(shoppingCart._id, {
      $inc: {
        quantity: quantity,
      },
      initialCost:
        quantity == -1
          ? shoppingCart.initialCost - book.price
          : shoppingCart.initialCost + book.price,
      finalCost:
        quantity == -1
          ? shoppingCart.initialCost - book.price
          : shoppingCart.initialCost + book.price,
    });
    await book.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        shoppingCart,
      },
    });
  }
}
export default new ShoppingCartRoute().router;
