import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";

import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
import { BookModel } from "../../models/book/book.model";
import _, { method } from "lodash";
import { bookService } from "../../models/book/book.service";
import { OrderModel } from "../../models/order/order.model";
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  ShoppingCartStatusEnum,
  PaymentMethodEnum,
} from "../../constants/model.const";
import { shoppingCartService } from "../../models/shoppingCart/shoppingCart.service";
import { ShoppingCartModel } from "../../models/shoppingCart/shoppingCart.model";
import { userService } from "../../models/user/user.service";
import { UtilsHelper } from "../../helper/utils.helper";
import { InvoiceModel } from "../../models/invoice/invoice.model";
import { OrderHelper } from "../../models/order/order.helper";
import { WalletModel } from "../../models/wallet/wallet.model";
import { walletService } from "../../models/wallet/wallet.service";
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
      throw ErrorHelper.unauthorized();
    }
  }
  //getAllShoppingCart
  async getAllShoppingCart(req: Request, res: Response) {
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
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
    var { limit, page, search, order } = req.body;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    let filter: any = {
      status: ShoppingCartStatusEnum.IN_CART,
      userId: req.tokenInfo._id,
    };
    const shoppingCarts = await shoppingCartService.fetch(
      {
        filter: filter,
        order: order,
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
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
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
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
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
      userId: req.tokenInfo._id,
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
        bookName: book.name,
        quantity: quantity,
        initialCost: book.price * quantity,
        userId: req.tokenInfo._id,
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
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
    const { shoppingCartIds, address, note, phoneNumber, paymentMethod } =
      req.body;
    if (
      !shoppingCartIds ||
      shoppingCartIds.length < 1 ||
      !phoneNumber ||
      !address
    ) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let user = await UserModel.findById(req.tokenInfo._id);
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
    });
    if (paymentMethod == PaymentMethodEnum.WALLET) {
      let wallet = await WalletModel.findById(user.walletId);
      if (wallet.balance < initialCost + 20000) {
        throw ErrorHelper.forbidden("Wallet balance is not enough!");
      }
      await walletService.updateOne(wallet._id, {
        $inc: { balance: -(initialCost + 20000) },
      });
    }

    shoppingCarts.map(async (shoppingCart) => {
      shoppingCart.status = ShoppingCartStatusEnum.SUCCESS;
      await shoppingCart.save();
    });
    let code = await OrderHelper.generateOrderCode();
    let order = new OrderModel({
      code: code,
      userId: req.tokenInfo._id,
      shoppingCartIds: shoppingCartIds,
      phone: newPhone,
      address: address,
      note: note,
      status:
        paymentMethod == "CASH"
          ? OrderStatusEnum.PENDING
          : OrderStatusEnum.UNPAID,
      isPaid: paymentMethod == PaymentMethodEnum.ATM ? false : true,
      shippingFee: 20000,
      initialCost: initialCost,
      finalCost: initialCost + 20000,
      paymentMethod: paymentMethod || PaymentMethodEnum.CASH,
      paymentStatus:
        paymentMethod == PaymentMethodEnum.ATM
          ? PaymentStatusEnum.PENDING
          : PaymentStatusEnum.SUCCESS,
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
            categoryIds: {
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
            categoryIds: {
              $each: [],
              $slice: -10,
            },
          },
        }
      ),
    ]);
    if (paymentMethod == "ATM") {
      const invoice = new InvoiceModel({
        userId: req.tokenInfo._id,
        amount: Number(order.finalCost),
        type: "PAYMENT",
        orderId: order._id,
      });
      await invoice.save();
      const MERCHANT_KEY = process.env.MERCHANT_KEY;
      const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
      const END_POINT = process.env.END_POINT_9PAY;
      const time = Math.round(Date.now() / 1000);
      const returnUrl = "https://bookstore-client-phi.vercel.app";
      let parameters;
      parameters = {
        merchantKey: MERCHANT_KEY,
        time: time,
        invoice_no: invoice._id,
        amount: Number(order.finalCost),
        description: "Thanh toán đơn hàng",
        return_url: returnUrl,
        method: "ATM_CARD",
      };

      const httpQuery = await UtilsHelper.buildHttpQuery(parameters);
      const message =
        "POST" +
        "\n" +
        END_POINT +
        "/payments/create" +
        "\n" +
        time +
        "\n" +
        httpQuery;
      const signature = await UtilsHelper.buildSignature(
        message,
        MERCHANT_SECRET_KEY
      );
      const baseEncode = Buffer.from(JSON.stringify(parameters)).toString(
        "base64"
      );
      const httpBuild = {
        baseEncode: baseEncode,
        signature: signature,
      };
      const buildHttpQuery = await UtilsHelper.buildHttpQuery(httpBuild);
      const directUrl = END_POINT + "/portal?" + buildHttpQuery;
      return res.status(200).json({
        status: 200,
        code: "200",
        message: "success",
        data: { order: order, url: directUrl },
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

  async updateQuantityBookInCart(req: Request, res: Response) {
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
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
    // const tokenData: any = TokenHelper.decodeToken(req.get("x-token"));
    // if (!tokenData) {
    //   throw ErrorHelper.unauthorized();
    // }
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
