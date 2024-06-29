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
  paymentMethodEnum,
} from "../../constants/model.const";
import { shoppingCartService } from "../../models/shoppingCart/shoppingCart.service";
import { ShoppingCartModel } from "../../models/shoppingCart/shoppingCart.model";
import { userService } from "../../models/user/user.service";
import { UtilsHelper } from "../../helper/utils.helper";
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
      [this.authentication],
      this.route(this.getOneShoppingCart)
    );
    this.router.post(
      "/addBookToCart",
      [this.authentication],
      this.route(this.addBookToCart)
    );
    this.router.post(
      "/paymentShoppingCart",
      [this.authentication],
      this.route(this.paymentShoppingCart)
    );
    this.router.post(
      "/updateQuantityBookInCart",
      [this.authentication],
      this.route(this.updateQuantityBookInCart)
    );
    this.router.post(
      "/deleteProductInCart",
      [this.authentication],
      this.route(this.deleteProductInCart)
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
  //getAllShoppingCart
  async getAllShoppingCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (!tokenData) {
      throw ErrorHelper.unauthorized();
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
    if (!tokenData) {
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
    if (!tokenData) {
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
    if (!tokenData) {
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
    var newPhone = UtilsHelper.parsePhone(phoneNumber, "+84");
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
      await shoppingCart.save();
    });
    let order = new OrderModel({
      userId: tokenData._id,
      shoppingCartIds: shoppingCartIds,
      phone: newPhone,
      address: address,
      note: note,
      status: OrderStatusEnum.PENDING,
      isPaid: true,
      shippingFee: 30000,
      initialCost: initialCost,
      finalCost: initialCost + 30000,
      paymentMethod: paymentMethodEnum.CASH,
    });
    await order.save();
    let bookCategoryIds: any = [];
    shoppingCarts.map(async (shoppingCart: any) => {
      let book = await BookModel.findById(shoppingCart.bookId);
      bookCategoryIds.push(book.categoryId);
    });
    await Promise.all([
      UserModel.updateOne(
        { _id: order.userId },
        {
          $addToSet: {
            searchs: {
              $each: bookCategoryIds,
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

  async updateQuantityBookInCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (!tokenData) {
      throw ErrorHelper.unauthorized();
    }
    const { shoppingCartId, quantity } = req.body;
    let shoppingCart = await ShoppingCartModel.findById(shoppingCartId);
    if (!shoppingCart) {
      throw ErrorHelper.recoredNotFound("shoppingCart!");
    }
    let book = await BookModel.findById(shoppingCart.bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    if (quantity == 0) {
      await bookService.updateOne(book._id, {
        $inc: {
          quantity: shoppingCart.quantity,
        },
      });
      await ShoppingCartModel.deleteOne(shoppingCart._id);
    } else {
      await shoppingCartService.updateOne(shoppingCart._id, {
        quantity: quantity,
        initialCost: quantity * book.price,
        finalCost: quantity * book.price,
      });
    }
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
  async deleteProductInCart(req: Request, res: Response) {
    const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    if (!tokenData) {
      throw ErrorHelper.unauthorized();
    }
    const { shoppingCartId } = req.body;
    let shoppingCart = await ShoppingCartModel.findById(shoppingCartId);
    if (!shoppingCart) {
      throw ErrorHelper.recoredNotFound("shoppingCart!");
    }
    let book = await BookModel.findById(shoppingCart.bookId);
    if (!book) {
      throw ErrorHelper.recoredNotFound("book!");
    }
    await bookService.updateOne(book._id, {
      $inc: {
        quantity: shoppingCart.quantity,
      },
    });
    await ShoppingCartModel.deleteOne(shoppingCart._id);
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
