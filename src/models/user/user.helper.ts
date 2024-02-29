import { TokenHelper } from "../../helper/token.helper";
import { IUser } from "./user.model";

export class UserHelper {
  constructor(private user: IUser) {}
  value() {
    return this.user;
  }
  getToken(key?: string) {
    return TokenHelper.generateToken({
      role_: this.user.role,
      _id: this.user._id,
      key: key ?? "",
      username: this.user.name || this.user.phone || this.user.role,
    });
  }
}
