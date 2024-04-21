import { BaseRoute } from "../../base/baseRoute";
import { Request, Response } from "../../base/baseRoute";
import { BookCategoryModel } from "../../models/bookCategory/bookCategory.model";
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
}
export default new BookCategoryRoute().router;
