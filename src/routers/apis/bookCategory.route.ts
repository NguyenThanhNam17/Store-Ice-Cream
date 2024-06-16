import { bookCategoryService } from "../../models/bookCategory/book.service";
import { BaseRoute, NextFunction } from "../../base/baseRoute";
import { Request, Response } from "../../base/baseRoute";
import { BookCategoryModel } from "../../models/bookCategory/bookCategory.model";
import { ErrorHelper } from "../../base/error";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import { UserModel } from "../../models/user/user.model";
class BookCategoryRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post(
      "/getAllBookCategory",
      this.route(this.getAllBookCategory)
    );
    this.router.post(
      "/createBookCategory",
      [this.authentication],
      this.route(this.createBookCategory)
    );
    this.router.post(
      "/updateBookCategory",
      [this.authentication],
      this.route(this.updateBookCategory)
    );
    this.router.post(
      "/deleteOneBookCategory",
      [this.authentication],
      this.route(this.deleteOneBookCategory)
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
  //getAllBookCategory
  async getAllBookCategory(req: Request, res: Response) {
    const bookCategories = await BookCategoryModel.find({});
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        bookCategories,
      },
    });
  }

  async createBookCategory(req: Request, res: Response) {
    const { key, name } = req.body;
    let bookCategory = new BookCategoryModel({
      key: key,
      name: name,
    });
    await bookCategory.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        bookCategory,
      },
    });
  }
  async deleteOneBookCategory(req: Request, res: Response) {
    const { id } = req.body;
    let bookCategory = await BookCategoryModel.findById(id);
    if (!bookCategory) {
      throw ErrorHelper.recoredNotFound("Category!");
    }
    await BookCategoryModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        bookCategory,
      },
    });
  }
  async updateBookCategory(req: Request, res: Response) {
    const { id, name } = req.body;
    let bookCategory = await BookCategoryModel.findById(id);
    if (!bookCategory) {
      throw ErrorHelper.recoredNotFound("Category!");
    }
    bookCategory.name = name || bookCategory.name;
    await bookCategory.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        bookCategory,
      },
    });
  }
}

export default new BookCategoryRoute().router;
