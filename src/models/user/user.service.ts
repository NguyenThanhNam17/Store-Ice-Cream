import { CrudService } from "../../base/crudService";
import { UserModel } from "./user.model";

class UserService extends CrudService<typeof UserModel> {
  constructor() {
    super(UserModel);
  }
}

const userService = new UserService();

export { userService };
