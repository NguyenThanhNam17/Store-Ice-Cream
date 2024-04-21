import { CrudService } from "../../base/crudService";
import { BookModel } from "./book.model";

class BookService extends CrudService<typeof BookModel> {
  constructor() {
    super(BookModel);
  }
}

const bookService = new BookService();

export { bookService };
