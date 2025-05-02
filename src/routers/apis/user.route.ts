import { ErrorHelper } from "../../base/error";
import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../base/baseRoute";
import { model } from "mongoose";
import { UserModel } from "../../models/user/user.model";
import passwordHash from "password-hash";
import { ROLES } from "../../constants/role.const";
import { UserHelper } from "../../models/user/user.helper";
import { TokenHelper } from "../../helper/token.helper";

class UserRoute extends BaseRoute {
  constructor() {
    super();
  }

  customRouting() {
    this.router.post("/login", this.route(this.login));
    this.router.post("/register", this.route(this.register));
  }

  async login(req: Request, res: Response) {
    let { username, password } = req.body;

    if (!username || !password) {
      throw ErrorHelper.requestDataInvalid("request data");
    }
    let user = await UserModel.findOne({
      $or: [{ phone: username }, { email: username }],
    });
    if (!user) {
      throw ErrorHelper.userNotExist();
    }

    let check = passwordHash.verify(password, user.password);
    if (!check) {
      throw ErrorHelper.userPasswordNotCorrect();
    }
    const key = TokenHelper.generateKey();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
        token: new UserHelper(user).getToken(key),
      },
    });
  }

  async register(req: Request, res: Response) {
    let { username, password } = req.body;
    let user = await UserModel.findOne({
      $or: [{ phone: username }, { username: username }],
    });
    if (user) {
      throw ErrorHelper.userExisted();
    }

    if (!username || !password) {
      throw ErrorHelper.requestDataInvalid("request data");
    }
    const key = TokenHelper.generateKey();
    user = new UserModel({
      username: username,
      phone: username,
      password: passwordHash.generate(password),
      role: ROLES.CLIENT,
      key: key,
    });
    await user.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
        token: new UserHelper(user).getToken(key),
      },
    });
  }
}

export default new UserRoute().router;
