"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("../../models/user/user.model");
var baseRoute_1 = require("../../base/baseRoute");
var token_helper_1 = require("../../helper/token.helper");
var role_const_1 = require("../../constants/role.const");
var error_1 = require("../../base/error");
var book_model_1 = require("../../models/book/book.model");
var book_service_1 = require("../../models/book/book.service");
var order_service_1 = require("../..//models/order/order.service");
var order_model_1 = require("../../models/order/order.model");
var model_const_1 = require("../../constants/model.const");
var shoppingCart_model_1 = require("../../models/shoppingCart/shoppingCart.model");
var utils_helper_1 = require("../../helper/utils.helper");
var phone_1 = __importDefault(require("phone"));
var invoice_model_1 = require("../../models/invoice/invoice.model");
var order_helper_1 = require("../../models/order/order.helper");
var wallet_model_1 = require("../../models/wallet/wallet.model");
var wallet_service_1 = require("../../models/wallet/wallet.service");
var OrderRoute = /** @class */ (function (_super) {
    __extends(OrderRoute, _super);
    function OrderRoute() {
        return _super.call(this) || this;
    }
    OrderRoute.prototype.customRouting = function () {
        this.router.post("/getAllOrder", [this.authentication], this.route(this.getAllOrder));
        this.router.post("/getAllOrderForAdmin", [this.authentication], this.route(this.getAllOrderForAdmin));
        this.router.post("/updateOrderForAdmin", [this.authentication], this.route(this.updateOrderForAdmin));
        this.router.post("/updateStatusOrder", [this.authentication], this.route(this.updateStatusOrder));
        this.router.post("/getOneOrder", [this.authentication], this.route(this.getOneOrder));
        this.router.post("/getBill", [this.authentication], this.route(this.getBill));
        this.router.post("/createOrder", [this.authentication], this.route(this.createOrder));
        this.router.post("/deleteOneOrder", [this.authentication], this.route(this.deleteOneOrder));
        this.router.post("/cancelOrder", [this.authentication], this.route(this.cancelOrder));
        this.router.post("/rePaymentOrder", [this.authentication], this.route(this.rePaymentOrder));
    };
    //Auth
    OrderRoute.prototype.authentication = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, user, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!req.get("x-token")) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.CLIENT, role_const_1.ROLES.STAFF].includes(tokenData.role_)) return [3 /*break*/, 2];
                        return [4 /*yield*/, user_model_1.UserModel.findById(tokenData._id)];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            throw error_1.ErrorHelper.userNotExist();
                        }
                        req.tokenInfo = tokenData;
                        next();
                        return [3 /*break*/, 3];
                    case 2: throw error_1.ErrorHelper.permissionDeny();
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        throw error_1.ErrorHelper.userWasOut();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //getAllOrder
    OrderRoute.prototype.getAllOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, limit, page, search, filter, orders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        try {
                            req.body.limit = parseInt(req.body.limit);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("limit");
                        }
                        try {
                            req.body.page = parseInt(req.body.page);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("page");
                        }
                        _a = req.body, limit = _a.limit, page = _a.page, search = _a.search;
                        filter = (req === null || req === void 0 ? void 0 : req.body) || {};
                        if (!limit) {
                            limit = 10;
                        }
                        if (!page) {
                            page = 1;
                        }
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.STAFF].includes(tokenData.role_)) {
                            filter.userId = tokenData._id;
                        }
                        return [4 /*yield*/, order_service_1.orderService.fetch({
                                filter: filter,
                                search: search,
                                limit: limit,
                                page: page,
                            }, ["user", "shoppingCarts"])];
                    case 1:
                        orders = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: orders,
                            })];
                }
            });
        });
    };
    //getAllOrderForAdmin
    OrderRoute.prototype.getAllOrderForAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, limit, page, search, filter, orders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.STAFF].includes(tokenData.role_)) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        try {
                            req.body.limit = parseInt(req.body.limit);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("limit");
                        }
                        try {
                            req.body.page = parseInt(req.body.page);
                        }
                        catch (err) {
                            throw error_1.ErrorHelper.requestDataInvalid("page");
                        }
                        _a = req.body, limit = _a.limit, page = _a.page, search = _a.search, filter = _a.filter;
                        if (!limit) {
                            limit = 10;
                        }
                        if (!page) {
                            page = 1;
                        }
                        return [4 /*yield*/, order_service_1.orderService.fetch({
                                filter: filter,
                                search: search,
                                limit: limit,
                                page: page,
                            }, ["user", "shoppingCarts"])];
                    case 1:
                        orders = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: orders,
                            })];
                }
            });
        });
    };
    //getOneOrder
    OrderRoute.prototype.getOneOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)
                                .populate("user")
                                .populate({
                                path: "shoppingCarts",
                                populate: {
                                    path: "book",
                                },
                            })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            //throw lỗi không tìm thấy
                            throw error_1.ErrorHelper.recoredNotFound("order!");
                        }
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    //get bill
    OrderRoute.prototype.getBill = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var shoppingCartIds, shoppingCarts, initialCost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shoppingCartIds = req.body.shoppingCartIds;
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.find({
                                _id: { $in: shoppingCartIds },
                            })];
                    case 1:
                        shoppingCarts = _a.sent();
                        initialCost = 0;
                        if (shoppingCarts.length < 1) {
                            //throw lỗi không tìm thấy
                            throw error_1.ErrorHelper.recoredNotFound("shoppingCart!");
                        }
                        shoppingCarts.map(function (shoppingCart) {
                            initialCost += shoppingCart.initialCost;
                        });
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    initialCost: initialCost,
                                    shippingFee: 30000,
                                    finalCost: initialCost + 30000,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.createOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, bookId, quantity, address, note, phoneNumber, paymentMethod, book, newPhone, phoneCheck, initialCost, wallet, shoppingCart, code, order, invoice, MERCHANT_KEY, MERCHANT_SECRET_KEY, END_POINT, time, returnUrl, parameters, httpQuery, message, signature, baseEncode, httpBuild, buildHttpQuery, directUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        _a = req.body, bookId = _a.bookId, quantity = _a.quantity, address = _a.address, note = _a.note, phoneNumber = _a.phoneNumber, paymentMethod = _a.paymentMethod;
                        if (!bookId || !quantity || !address || !phoneNumber) {
                            throw error_1.ErrorHelper.requestDataInvalid("Invalid data!");
                        }
                        return [4 /*yield*/, book_model_1.BookModel.findById(bookId)];
                    case 1:
                        book = _b.sent();
                        if (book) {
                            throw error_1.ErrorHelper.recoredNotFound("order!");
                        }
                        newPhone = utils_helper_1.UtilsHelper.parsePhone(phoneNumber, "+84");
                        phoneCheck = (0, phone_1.default)(newPhone);
                        if (!phoneCheck.isValid) {
                            throw error_1.ErrorHelper.requestDataInvalid("phone");
                        }
                        initialCost = book.price * quantity;
                        if (!(paymentMethod == model_const_1.PaymentMethodEnum.WALLET)) return [3 /*break*/, 3];
                        return [4 /*yield*/, wallet_model_1.WalletModel.findOne({ userId: tokenData._id })];
                    case 2:
                        wallet = _b.sent();
                        if (wallet.balance < initialCost + 20000) {
                            throw error_1.ErrorHelper.forbidden("Wallet balance is not enough!");
                        }
                        _b.label = 3;
                    case 3:
                        shoppingCart = new shoppingCart_model_1.ShoppingCartModel({
                            bookId: book._id,
                            bookName: book.name,
                            quantity: quantity,
                            initialCost: initialCost,
                            status: model_const_1.ShoppingCartStatusEnum.SUCCESS,
                        });
                        return [4 /*yield*/, shoppingCart.save()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, order_helper_1.OrderHelper.generateOrderCode()];
                    case 5:
                        code = _b.sent();
                        order = new order_model_1.OrderModel({
                            code: code,
                            shoppingCartIds: [shoppingCart._id],
                            quantity: quantity,
                            address: address,
                            note: note || "",
                            initialCost: initialCost,
                            discountAmount: 0,
                            finalCost: initialCost + 20000,
                            userId: tokenData._id,
                            phone: newPhone,
                            isPaid: true,
                            shippingFee: 20000,
                            status: paymentMethod == model_const_1.PaymentMethodEnum.CASH
                                ? model_const_1.OrderStatusEnum.PENDING
                                : model_const_1.OrderStatusEnum.UNPAID,
                            paymentMethod: paymentMethod || model_const_1.PaymentMethodEnum.CASH,
                        });
                        return [4 /*yield*/, order.save()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, Promise.all([
                                user_model_1.UserModel.updateOne({ _id: order.userId }, {
                                    $addToSet: {
                                        searchs: {
                                            $each: book.categoryId,
                                        },
                                    },
                                }),
                                //limit array size
                                user_model_1.UserModel.updateOne({ _id: order.userId }, {
                                    $push: {
                                        searchs: {
                                            $each: [],
                                            $slice: -10,
                                        },
                                    },
                                }),
                            ])];
                    case 7:
                        _b.sent();
                        if (!(paymentMethod == "ATM")) return [3 /*break*/, 12];
                        invoice = new invoice_model_1.InvoiceModel({
                            userId: tokenData._id,
                            amount: Number(order.finalCost),
                            type: "PAYMENT",
                            orderId: order._id,
                        });
                        return [4 /*yield*/, invoice.save()];
                    case 8:
                        _b.sent();
                        MERCHANT_KEY = process.env.MERCHANT_KEY;
                        MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
                        END_POINT = process.env.END_POINT_9PAY;
                        time = Math.round(Date.now() / 1000);
                        returnUrl = "https://bookstore-client-64hy9o9zy-thuanaaas-projects.vercel.app";
                        parameters = void 0;
                        parameters = {
                            merchantKey: MERCHANT_KEY,
                            time: time,
                            invoice_no: invoice._id,
                            amount: Number(order.finalCost),
                            description: "Thanh toán đơn hàng",
                            return_url: returnUrl,
                            method: "ATM_CARD",
                        };
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildHttpQuery(parameters)];
                    case 9:
                        httpQuery = _b.sent();
                        message = "POST" +
                            "\n" +
                            END_POINT +
                            "/payments/create" +
                            "\n" +
                            time +
                            "\n" +
                            httpQuery;
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildSignature(message, MERCHANT_SECRET_KEY)];
                    case 10:
                        signature = _b.sent();
                        baseEncode = Buffer.from(JSON.stringify(parameters)).toString("base64");
                        httpBuild = {
                            baseEncode: baseEncode,
                            signature: signature,
                        };
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildHttpQuery(httpBuild)];
                    case 11:
                        buildHttpQuery = _b.sent();
                        directUrl = END_POINT + "/portal?" + buildHttpQuery;
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: directUrl,
                            })];
                    case 12: return [2 /*return*/, res.status(200).json({
                            status: 200,
                            code: "200",
                            message: "success",
                            data: {
                                order: order,
                            },
                        })];
                }
            });
        });
    };
    //update order for admin
    OrderRoute.prototype.updateOrderForAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, address, note, status, phoneNumber, noteUpdate, tokenData, order, newPhone, phoneCheck, shoppingCarts, wallet;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, address = _a.address, note = _a.note, status = _a.status, phoneNumber = _a.phoneNumber, noteUpdate = _a.noteUpdate;
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.STAFF].includes(tokenData.role_)) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("Book");
                        }
                        if (model_const_1.OrderStatusEnum.CANCEL == order.status) {
                            throw error_1.ErrorHelper.forbidden("The order is canceled!");
                        }
                        else {
                            if (model_const_1.OrderStatusEnum.SUCCESS == order.status) {
                                throw error_1.ErrorHelper.forbidden("The order is success!");
                            }
                        }
                        newPhone = utils_helper_1.UtilsHelper.parsePhone(phoneNumber, "+84");
                        phoneCheck = (0, phone_1.default)(newPhone);
                        if (!phoneCheck.isValid) {
                            throw error_1.ErrorHelper.requestDataInvalid("phone");
                        }
                        return [4 /*yield*/, order_service_1.orderService.updateOne(order._id, {
                                address: address || order.address,
                                note: note || order.note,
                                status: status || order.status,
                                phone: newPhone || order.phone,
                                noteUpdate: noteUpdate || order.noteUpdate,
                            })];
                    case 2:
                        _b.sent();
                        if (!(status == model_const_1.OrderStatusEnum.CANCEL)) return [3 /*break*/, 4];
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.find({
                                _id: order.shoppingCartIds,
                            })];
                    case 3:
                        shoppingCarts = _b.sent();
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, book_service_1.bookService.updateOne(shoppingCart.bookId, {
                                            $inc: {
                                                quantity: shoppingCart.quantity,
                                            },
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _b.label = 4;
                    case 4: return [4 /*yield*/, wallet_model_1.WalletModel.findOne({ userId: req.tokenInfo._id })];
                    case 5:
                        wallet = _b.sent();
                        return [4 /*yield*/, wallet_service_1.walletService.updateOne(wallet._id, {
                                $inc: {
                                    balance: -order.finalCost,
                                },
                            })];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    //update status order for admin
    OrderRoute.prototype.updateStatusOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, status, tokenData, order, shoppingCarts;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, status = _a.status;
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.STAFF].includes(tokenData.role_)) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("order");
                        }
                        order.status = status;
                        order.save();
                        if (!(status == model_const_1.OrderStatusEnum.CANCEL)) return [3 /*break*/, 3];
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.find({
                                _id: order.shoppingCartIds,
                            })];
                    case 2:
                        shoppingCarts = _b.sent();
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, book_service_1.bookService.updateOne(shoppingCart.bookId, {
                                            $inc: {
                                                quantity: shoppingCart.quantity,
                                            },
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _b.label = 3;
                    case 3: return [2 /*return*/, res.status(200).json({
                            status: 200,
                            code: "200",
                            message: "success",
                            data: {
                                order: order,
                            },
                        })];
                }
            });
        });
    };
    //cancel order
    OrderRoute.prototype.cancelOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order, shoppingCarts, wallet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("Book!");
                        }
                        order.status = model_const_1.OrderStatusEnum.CANCEL;
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.find({
                                _id: order.shoppingCartIds,
                            })];
                    case 2:
                        shoppingCarts = _a.sent();
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, book_service_1.bookService.updateOne(shoppingCart.bookId, {
                                            $inc: {
                                                quantity: shoppingCart.quantity,
                                            },
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, order.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, wallet_model_1.WalletModel.findOne({ userId: req.tokenInfo._id })];
                    case 4:
                        wallet = _a.sent();
                        return [4 /*yield*/, wallet_service_1.walletService.updateOne(wallet._id, {
                                $inc: {
                                    balance: -order.finalCost,
                                },
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.deleteOneOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ([role_const_1.ROLES.ADMIN, role_const_1.ROLES.STAFF].includes(req.tokenInfo.role_)) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        id = req.body.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("Book!");
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.deleteOne({ _id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.rePaymentOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, orderId, paymentMethod, mine, order, wallet, invoice, MERCHANT_KEY, MERCHANT_SECRET_KEY, END_POINT, time, returnUrl, parameters, httpQuery, message, signature, baseEncode, httpBuild, buildHttpQuery, directUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, orderId = _a.orderId, paymentMethod = _a.paymentMethod;
                        return [4 /*yield*/, user_model_1.UserModel.findById(req.tokenInfo._id)];
                    case 1:
                        mine = _b.sent();
                        if (!mine) {
                            throw error_1.ErrorHelper.userNotExist();
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.findById(orderId)];
                    case 2:
                        order = _b.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("order!");
                        }
                        if (order.isPaid) {
                            throw error_1.ErrorHelper.forbidden("The order is paid");
                        }
                        if (!(paymentMethod == model_const_1.PaymentMethodEnum.CASH)) return [3 /*break*/, 3];
                        order.paymentMethod = model_const_1.PaymentMethodEnum.CASH;
                        order.paymentStatus = model_const_1.PaymentStatusEnum.SUCCESS;
                        order.isPaid = true;
                        return [3 /*break*/, 13];
                    case 3:
                        if (!(paymentMethod == model_const_1.PaymentMethodEnum.WALLET)) return [3 /*break*/, 8];
                        return [4 /*yield*/, wallet_model_1.WalletModel.findById(mine.walletId)];
                    case 4:
                        wallet = _b.sent();
                        if (!(wallet.balance < order.finalCost)) return [3 /*break*/, 5];
                        throw error_1.ErrorHelper.forbidden("Wallet balance is not enough!");
                    case 5: return [4 /*yield*/, wallet_service_1.walletService.updateOne(mine.walletId, {
                            $inc: {
                                balance: -order.finalCost,
                            },
                        })];
                    case 6:
                        _b.sent();
                        order.paymentStatus = model_const_1.PaymentStatusEnum.SUCCESS;
                        order.isPaid = true;
                        _b.label = 7;
                    case 7: return [3 /*break*/, 13];
                    case 8:
                        invoice = new invoice_model_1.InvoiceModel({
                            userId: req.tokenInfo._id,
                            amount: order.finalCost,
                            type: "PAYMENT",
                            orderId: order._id,
                        });
                        return [4 /*yield*/, invoice.save()];
                    case 9:
                        _b.sent();
                        MERCHANT_KEY = process.env.MERCHANT_KEY;
                        MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
                        END_POINT = process.env.END_POINT_9PAY;
                        time = Math.round(Date.now() / 1000);
                        returnUrl = "https://bookstore-client-64hy9o9zy-thuanaaas-projects.vercel.app";
                        parameters = void 0;
                        parameters = {
                            merchantKey: MERCHANT_KEY,
                            time: time,
                            invoice_no: invoice._id,
                            amount: order.finalCost,
                            description: "Thanh toán đơn hàng",
                            return_url: returnUrl,
                            method: "ATM_CARD",
                        };
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildHttpQuery(parameters)];
                    case 10:
                        httpQuery = _b.sent();
                        message = "POST" +
                            "\n" +
                            END_POINT +
                            "/payments/create" +
                            "\n" +
                            time +
                            "\n" +
                            httpQuery;
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildSignature(message, MERCHANT_SECRET_KEY)];
                    case 11:
                        signature = _b.sent();
                        baseEncode = Buffer.from(JSON.stringify(parameters)).toString("base64");
                        httpBuild = {
                            baseEncode: baseEncode,
                            signature: signature,
                        };
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildHttpQuery(httpBuild)];
                    case 12:
                        buildHttpQuery = _b.sent();
                        directUrl = END_POINT + "/portal?" + buildHttpQuery;
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: directUrl,
                            })];
                    case 13: return [2 /*return*/, res.status(200).json({
                            status: 200,
                            code: "200",
                            message: "success",
                            data: {},
                        })];
                }
            });
        });
    };
    return OrderRoute;
}(baseRoute_1.BaseRoute));
exports.default = new OrderRoute().router;
//# sourceMappingURL=order.route.js.map