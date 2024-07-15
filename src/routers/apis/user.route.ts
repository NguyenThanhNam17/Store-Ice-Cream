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
import { BookModel } from "../../models/book/book.model";
import { bookService } from "../../models/book/book.service";
import { UtilsHelper } from "../../helper/utils.helper";
import { WalletModel } from "../../models/wallet/wallet.model";
import { walletService } from "../../models/wallet/wallet.service";
import { InvoiceModel } from "../../models/invoice/invoice.model";
import { OrderModel } from "../../models/order/order.model";
import { OrderStatusEnum } from "../../constants/model.const";
import moment from "moment-timezone";
import _ from "lodash";
import { invoiceService } from "../../models/invoice/invoice.service";
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
      "/getOneUser",
      [this.authentication],
      this.route(this.getOneUser)
    );
    this.router.post("/getMe", [this.authentication], this.route(this.getMe));
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
    this.router.post(
      "/changePasswordForAdmin",
      [this.authentication],
      this.route(this.changePasswordForAdmin)
    );
    this.router.post(
      "/changePassword",
      [this.authentication],
      this.route(this.changePassword)
    );
    this.router.post(
      "/depositToWallet",
      [this.authentication],
      this.route(this.depositToWallet)
    );
    this.router.post(
      "/getStatsForDashboard",
      [this.authentication],
      this.route(this.getStatsForDashboard)
    );
    this.router.post(
      "/getAllTransHistoryByWallet",
      [this.authentication],
      this.route(this.getAllTransHistoryByWallet)
    );
  }

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
      throw ErrorHelper.unauthorized();
    }
  }
  //register
  async register(req: Request, res: Response) {
    const { name, phoneNumber, password } = req.body;
    if (!name || !phoneNumber || !password) {
      throw ErrorHelper.requestDataInvalid("Invalid data!");
    }
    var newPhone = UtilsHelper.parsePhone(phoneNumber, "+84");
    let phoneCheck = phone(newPhone);
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
    let wallet = new WalletModel({
      userId: user._id,
      balance: 0,
    });
    user.walletId = wallet._id;
    await wallet.save();
    await userService.updateOne(user._id, {
      $set: {
        walletId: wallet._id,
      },
    });
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
    if (user.isBlock == true) {
      throw ErrorHelper.userWasBlock();
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
    var { limit, page, search, order, filter, fromDate, toDate } = req.body;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    if (fromDate && toDate) {
      fromDate = moment(fromDate).startOf("day").subtract(7, "hours").toDate();
      toDate = moment(toDate).endOf("day").subtract(7, "hours").toDate();
      _.set(req, "body.filter.createdAt", { $gte: fromDate, $lte: toDate });
    }
    const users = await userService.fetch({
      filter: filter,
      order: order,
      search: search,
      limit: limit,
      page: page,
    });
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: users,
    });
  }

  //getOneUser
  async getOneUser(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    let { id } = req.body;
    const user: any = await UserModel.findById(id);
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
  //getMe
  async getMe(req: Request, res: Response) {
    const user: any = await UserModel.findById(req.tokenInfo._id).populate(
      "wallet"
    );
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
    const { password, name, phoneNumber, gender, address, email, role } =
      req.body;
    var newPhone = UtilsHelper.parsePhone(phoneNumber, "+84");
    let phoneCheck = phone(newPhone);
    if (!phoneCheck.isValid) {
      throw ErrorHelper.requestDataInvalid("phone");
    }
    let userCheck = await UserModel.findOne({
      $or: [{ email: phone ?? "" }, { phone: phoneCheck.phoneNumber ?? "" }],
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
      phone: phoneCheck.phoneNumber,
      address: address,
      key: key,
      role: role,
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
    userCheck.name = name || userCheck.name;
    userCheck.email = email || userCheck.email;
    userCheck.gender = gender || userCheck.gender;
    userCheck.address = address || userCheck.address;
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
    const { id, name, gender, address, email, isBlock } = req.body;
    let userCheck = await UserModel.findById(id);
    if (!userCheck) {
      throw ErrorHelper.userNotExist();
    }
    userCheck.name = name || userCheck.name;
    userCheck.email = email || userCheck.email;
    userCheck.gender = gender || userCheck.gender;
    userCheck.address = address || userCheck.address;
    if (isBlock != null) {
      userCheck.isBlock = isBlock;
    }

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
  async changePassword(req: Request, res: Response) {
    const { id, oldPass, newPass } = req.body;

    let user = await UserModel.findById(id);
    if (!user) {
      throw ErrorHelper.userNotExist();
    }
    if (passwordHash.verify(oldPass, user.password)) {
      user.password = passwordHash.generate(newPass);
      await user.save();
    } else {
      throw ErrorHelper.userPasswordNotCorrect();
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
  async changePasswordForAdmin(req: Request, res: Response) {
    if (ROLES.ADMIN != req.tokenInfo.role_) {
      throw ErrorHelper.permissionDeny();
    }
    const { id, newPass } = req.body;

    let user = await UserModel.findById(id);
    if (!user) {
      throw ErrorHelper.userNotExist();
    }
    user.password = passwordHash.generate(newPass);
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
  async depositToWallet(req: Request, res: Response) {
    const { balance } = req.body;
    let userCheck = await UserModel.findById(req.tokenInfo._id);
    console.log(userCheck);
    if (!userCheck) {
      throw ErrorHelper.userNotExist();
    }
    let wallet = await WalletModel.findById(userCheck.walletId);
    if (!wallet) {
      throw ErrorHelper.recoredNotFound("wallet!");
    }
    const invoice = new InvoiceModel({
      userId: req.tokenInfo._id,
      amount: balance,
      type: "DEPOSIT",
      walletId: wallet.id,
    });
    await invoice.save();
    const MERCHANT_KEY = process.env.MERCHANT_KEY;
    const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
    const END_POINT = process.env.END_POINT_9PAY;
    const time = Math.round(Date.now() / 1000);
    const returnUrl = "https://bookstore-client-phi.vercel.app/";
    let parameters;
    parameters = {
      merchantKey: MERCHANT_KEY,
      time: time,
      invoice_no: invoice._id,
      amount: balance,
      description: "Nạp tiền vào ví",
      return_url: returnUrl,
      method: "ATM_CARD",
    };

    const httpQuery = await UtilsHelper.buildHttpQuery(parameters);
    const message =
      "POST" +
      "\n" +
      END_POINT +
      "/payments/create" +
      "\n" +
      time +
      "\n" +
      httpQuery;
    const signature = await UtilsHelper.buildSignature(
      message,
      MERCHANT_SECRET_KEY
    );
    const baseEncode = Buffer.from(JSON.stringify(parameters)).toString(
      "base64"
    );
    const httpBuild = {
      baseEncode: baseEncode,
      signature: signature,
    };
    const buildHttpQuery = await UtilsHelper.buildHttpQuery(httpBuild);
    const directUrl = END_POINT + "/portal?" + buildHttpQuery;
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: directUrl,
    });
  }
  async getStatsForDashboard(req: Request, res: Response) {
    // if (![ROLES.ADMIN, ROLES.STAFF].includes(req.tokenInfo.role_)) {
    //   throw ErrorHelper.permissionDeny();
    // }
    let startOfDay = moment().startOf("day").toDate();
    let endOfDate = moment().endOf("day").toDate();
    let startOfWeek = moment().startOf("week").toDate();
    let endOfWeek = moment().endOf("week").toDate();
    let startOfMonth = moment().startOf("month").toDate();
    let endOfMonth = moment().endOf("month").toDate();
    let startOfYear = moment().startOf("year").toDate();
    let endOfYear = moment().endOf("year").toDate();
    let getStatsUser = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          countStaff: {
            $sum: {
              $cond: [{ $eq: ["$role", ROLES.STAFF] }, 1, 0],
            },
          },
          countClient: {
            $sum: {
              $cond: [{ $eq: ["$role", ROLES.CLIENT] }, 1, 0],
            },
          },
          countClientThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfMonth] },
                    { $lte: ["$createdAt", endOfMonth] },
                    { $eq: ["$role", ROLES.CLIENT] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          countStaffThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfMonth] },
                    { $lte: ["$createdAt", endOfMonth] },
                    { $eq: ["$role", ROLES.CLIENT] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    let getStatsBook = await BookModel.aggregate([
      {
        $group: {
          _id: null,
          countBook: {
            $sum: "$quantity",
          },
          countSoldBook: {
            $sum: "$soldQuantity",
          },
        },
      },
    ]);
    let getStatsRevenue = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          countOrders: {
            $sum: 1,
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$status", OrderStatusEnum.SUCCESS] },
                "$finalCost",
                0,
              ],
            },
          },
          revenueToDay: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfDay] },
                    { $lte: ["$createdAt", endOfDate] },
                    { $eq: ["$status", OrderStatusEnum.SUCCESS] },
                  ],
                },
                "$finalCost",
                0,
              ],
            },
          },
          revenueThisWeek: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfWeek] },
                    { $lte: ["$createdAt", endOfWeek] },
                    { $eq: ["$status", OrderStatusEnum.SUCCESS] },
                  ],
                },
                "$finalCost",
                0,
              ],
            },
          },
          revenueThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfMonth] },
                    { $lte: ["$createdAt", endOfMonth] },
                    { $eq: ["$status", OrderStatusEnum.SUCCESS] },
                  ],
                },
                "$finalCost",
                0,
              ],
            },
          },
          revenueThisYear: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfYear] },
                    { $lte: ["$createdAt", endOfYear] },
                    { $eq: ["$status", OrderStatusEnum.SUCCESS] },
                  ],
                },
                "$finalCost",
                0,
              ],
            },
          },
        },
      },
    ]);
    let getStatRevenueThisYear: any = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
          status: OrderStatusEnum.SUCCESS,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          month: {
            $first: { $month: "$createdAt" },
          },
          totalRevenue: {
            $sum: "$finalCost",
          },
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    let statRevenueByMonth: any = {};
    getStatRevenueThisYear.map((item: any) => {
      if (item.month == 1) {
        statRevenueByMonth.january = item.totalRevenue;
      } else if (item.month == 2) {
        statRevenueByMonth.february = item.totalRevenue;
      } else if (item.month == 3) {
        statRevenueByMonth.march = item.totalRevenue;
      } else if (item.month == 4) {
        statRevenueByMonth.april = item.totalRevenue;
      } else if (item.month == 5) {
        statRevenueByMonth.may = item.totalRevenue;
      } else if (item.month == 6) {
        statRevenueByMonth.june = item.totalRevenue;
      } else if (item.month == 7) {
        statRevenueByMonth.july = item.totalRevenue;
      } else if (item.month == 8) {
        statRevenueByMonth.august = item.totalRevenue;
      } else if (item.month == 9) {
        statRevenueByMonth.september = item.totalRevenue;
      } else if (item.month == 10) {
        statRevenueByMonth.october = item.totalRevenue;
      } else if (item.month == 11) {
        statRevenueByMonth.november = item.totalRevenue;
      } else if (item.month == 12) {
        statRevenueByMonth.december = item.totalRevenue;
      }
    });
    getStatRevenueThisYear = {
      january: statRevenueByMonth.january || 0,
      february: statRevenueByMonth.february || 0,
      march: statRevenueByMonth.march || 0,
      april: statRevenueByMonth.april || 0,
      may: statRevenueByMonth.may || 0,
      june: statRevenueByMonth.june || 0,
      july: statRevenueByMonth.july || 0,
      august: statRevenueByMonth.august || 0,
      september: statRevenueByMonth.september || 0,
      october: statRevenueByMonth.october || 0,
      november: statRevenueByMonth.november || 0,
      december: statRevenueByMonth.december || 0,
    };

    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: {
        totalClients: getStatsUser[0]?.countClient || 0,
        totalClientsThisMonth: getStatsUser[0]?.countClientThisMonth || 0,
        totalStaffs: getStatsUser[0]?.countStaff || 0,
        totalStaffsThisMonth: getStatsUser[0]?.countStaffThisMonth || 0,
        totalBooks: getStatsBook[0]?.countBook || 0,
        totalSoldBooks: getStatsBook[0]?.countSoldBook || 0,
        totalOrders: getStatsRevenue[0]?.countOrders || 0,
        revenue: getStatsRevenue[0]?.revenue || 0,
        revenueToDay: getStatsRevenue[0]?.revenueToDay || 0,
        revenueThisWeek: getStatsRevenue[0]?.revenueThisWeek || 0,
        revenueThisMonth: getStatsRevenue[0]?.revenueThisMonth || 0,
        revenueThisYear: getStatsRevenue[0]?.revenueThisYear || 0,
        getStatRevenueThisYear,
      },
    });
  }
  async getAllTransHistoryByWallet(req: Request, res: Response) {
    let user = await UserModel.findById(req.tokenInfo._id);
    if (!user) {
      throw ErrorHelper.userNotExist();
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
    var { limit, page, search, order, filter }: any = req.body;
    if (!limit) {
      req.body.limit = 10;
    }
    if (!page) {
      req.body.page = 1;
    }
    _.set(req, "body.filter.userId", user.id);
    _.set(req, "body.filter.walletId", { $exists: true });
    let trans = await invoiceService.fetch(req.body);
    return res.status(200).json({
      status: 200,
      code: "200",
      message: "success",
      data: trans,
    });
  }
}
export default new UserRoute().router;
