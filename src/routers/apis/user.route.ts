import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import passwordHash from "password-hash";
import { UserHelper } from "../../models/user/user.helper";
import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
class UserRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/login", this.route(this.login));
    this.router.post(
      "/getAllClient",
      [this.authentication],
      this.route(this.getAllClient)
    );
    this.router.post(
      "/getOneClient/:id",
      [this.authentication],
      this.route(this.getOneClient)
    );
    this.router.post(
      "/createClient",
      [this.authentication],
      this.route(this.createClient)
    );
  }

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
  //login
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    let user = await UserModel.findOne({
      $or: [{ username: username }, { phone: username }],
    });
    if (!user) {
      throw ErrorHelper.userNotExist();
    }
    if (passwordHash.verify(password, user.password)) {
      const key = TokenHelper.generateKey();
      await UserModel.updateOne({ _id: user.id }, { $set: { key: key } });
      return res.status(200).json({
        status: 200,
        code: "200",
        message: "success",
        data: {
          user,
          token: new UserHelper(user).getToken(key),
        },
      });
    } else {
      throw ErrorHelper.userPasswordNotCorrect();
    }
  }
  //getAllUser
  async getAllClient(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const users = await UserModel.find({});
    console.log(users);
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        users,
      },
    });
  }

  //getOneUser
  async getOneClient(req: Request, res: Response) {
    const user: any = await UserModel.findById(req.params.id);
    if (!user) {
      //throw lỗi không tìm thấy
      throw ErrorHelper.userNotExist();
    }
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
      },
    });
  }
  async createClient(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { username, password, name, phone, gender, address } = req.body;

    let userCheck = await UserModel.findOne({
      $or: [{ username: username }, { phone: phone }],
    });
    if (userCheck) {
      throw ErrorHelper.forbidden("Username or phone number is existed!");
    }
    const key = TokenHelper.generateKey();
    const user = new UserModel({
      username: username,
      password: passwordHash.generate(password),
      name: name,
      gender: gender,
      phone: phone,
      address: address,
      key: key,
    });
    await user.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        user,
      },
    });
  }
}
export default new UserRoute().router;
