import { NextFunction } from "express";
import { UserModel } from "../../models/user/user.model";
import { BaseRoute } from "../../base/baseRoute";
import { TokenHelper } from "../../helper/token.helper";
import { ROLES } from "../../constants/role.const";
import passwordHash from "password-hash";
import { UserHelper } from "../../models/user/user.helper";
import { ErrorHelper } from "../../base/error";
import { Request, Response } from "../../base/baseRoute";
import phone from "phone";
import { userService } from "../../models/user/user.service";
class UserRoute extends BaseRoute {
  constructor() {
    super();
  }
  customRouting() {
    this.router.post("/register", this.route(this.register));
    this.router.post("/login", this.route(this.login));
    this.router.post(
      "/getAllUser",
      [this.authentication],
      this.route(this.getAllUser)
    );
    this.router.post(
      "/getOneUser/:id",
      [this.authentication],
      this.route(this.getOneUser)
    );
    this.router.post(
      "/createUser",
      [this.authentication],
      this.route(this.createUser)
    );
    this.router.post(
      "/updateMe",
      [this.authentication],
      this.route(this.updateMe)
    );
    this.router.post(
      "/updateUser",
      [this.authentication],
      this.route(this.updateUser)
    );
    this.router.post(
      "/deleteOneUser",
      [this.authentication],
      this.route(this.deleteOneUser)
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
  //register
  async register(req: Request, res: Response) {
    const { name, phoneNumber, password } = req.body;
    if (!name || !phoneNumber || !password) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    let phoneCheck = phone(phoneNumber);
    if (!phoneCheck.isValid) {
      throw ErrorHelper.requestDataInvalid("phone");
    }
    let userCheck = await UserModel.findOne({ phone: phoneNumber });
    if (userCheck) {
      throw ErrorHelper.userExisted();
    }
    const key = TokenHelper.generateKey();
    let user = new UserModel({
      name: name ? name.trim() : "",
      password: passwordHash.generate(password),
      phone: phoneCheck.phoneNumber,
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
  async getAllUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    try {
      req.body.limit = parseInt(req.body.limit);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("limit");
    }
    try {
      req.body.page = parseInt(req.body.page);
    } catch (err) {
      throw ErrorHelper.requestDataInvalid("page");
    }
    var { limit, page, search, filter } = req.body;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    const users = await userService.fetch({
      filter: filter,
      search: search,
      limit: limit,
      page: page,
    });
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
  async getOneUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
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
  async createUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { password, name, phone, gender, address, email } = req.body;

    let userCheck = await UserModel.findOne({
      $or: [{ email: phone ?? "" }, { phone: phone ?? "" }],
    });
    if (userCheck) {
      throw ErrorHelper.forbidden("Username or phone number is existed!");
    }
    const key = TokenHelper.generateKey();
    const user = new UserModel({
      email: email,
      password: passwordHash.generate(password),
      name: name.trim(),
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
  async updateMe(req: Request, res: Response) {
    const { name, gender, address, email } = req.body;
    let userCheck = await UserModel.findById(req.tokenInfo._id);
    if (!userCheck) {
      throw ErrorHelper.userNotExist();
    }
    userCheck.name = name;
    userCheck.email = email;
    userCheck.gender = gender;
    userCheck.address = address;
    await userCheck.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        userCheck,
      },
    });
  }
  async updateUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id, name, gender, address, email } = req.body;

    let userCheck = await UserModel.findById(id);
    if (!userCheck) {
      throw ErrorHelper.userNotExist();
    }
    userCheck.name = name;
    userCheck.email = email;
    userCheck.gender = gender;
    userCheck.address = address;
    await userCheck.save();
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        userCheck,
      },
    });
  }
  async deleteOneUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id } = req.body;

    let userCheck = await UserModel.findById(id);
    if (!userCheck) {
      throw ErrorHelper.userNotExist();
    }
    await UserModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        userCheck,
      },
    });
  }
}
export default new UserRoute().router;
