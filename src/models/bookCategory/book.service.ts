import { CrudService } from "../../base/crudService";
import { BookCategoryModel } from "./bookCategory.model";

class BookCategoryService extends CrudService<typeof BookCategoryModel> {
  constructor() {
    super(BookCategoryModel);
  }
}

const bookCategoryService = new BookCategoryService();

export { bookCategoryService };
