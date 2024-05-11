import { bookCategoryService } from "../../models/bookCategory/book.service";
import { BaseRoute } from "../../base/baseRoute";
import { Request, Response } from "../../base/baseRoute";
import { BookCategoryModel } from "../../models/bookCategory/bookCategory.model";
import { ErrorHelper } from "../..//base/error";
class BookCategoryRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post(
      "/getAllBookCategory",
      this.route(this.getAllBookCategory)
    );
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
  async deleteBookCategory(req: Request, res: Response) {
    const { id } = req.body;
    let bookCategory = await BookCategoryModel.findById(id);
    if (!bookCategory) {
      throw ErrorHelper.recoredNotFound("Category!");
    }
    await BookCategoryModel.deleteOne(id);
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
