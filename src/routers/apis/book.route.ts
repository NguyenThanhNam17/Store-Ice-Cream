import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import passwordHash from "password-hash";

import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
import { BookModel } from "../../models/book/book.model";
class BookRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/getAllBook", this.route(this.getAllBook));
    this.router.post("/getOneBook/:id", this.route(this.getOneBook));
    this.router.post(
      "/createBook",
      [this.authentication],
      this.route(this.createBook)
    );
    this.router.post(
      "/updateBook",
      [this.authentication],
      this.route(this.updateBook)
    );
    this.router.post(
      "/deleteOneBook",
      [this.authentication],
      this.route(this.deleteOneBook)
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
  //getAllBook
  async getAllBook(req: Request, res: Response) {
    const books = await BookModel.find({});
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        books,
      },
    });
  }

  //getOneBook
  async getOneBook(req: Request, res: Response) {
    const book: any = await UserModel.findById(req.params.id);
    if (!book) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.recoredNotFound("Book!");
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async createBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { name, author, category, description, price, quantity } = req.body;
    if (!name || !author || !category || !description) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    const book = new BookModel({
      name: name,
      author: author,
      category: category,
      description: description,
      price: price,
      quantity: quantity,
    });
    await book.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async updateBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id, name, author, category, description, price, quantity } =
      req.body;

    let book = await BookModel.findById(id);
    if (!book) {
      throw ErrorHelper.recoredNotFound("Book");
    }
    book.name = name;
    book.author = author;
    book.category = category;
    book.description = description;
    book.price = price;
    book.quantity;
    await book.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
  async deleteOneBook(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id } = req.body;

    let book = await BookModel.findById(id);
    if (!book) {
      throw ErrorHelper.recoredNotFound("Book!");
    }
    await BookModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        book,
      },
    });
  }
}
export default new BookRoute().router;
