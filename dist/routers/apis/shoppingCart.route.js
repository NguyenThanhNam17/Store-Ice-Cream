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
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("../../models/user/user.model");
var baseRoute_1 = require("../../base/baseRoute");
var token_helper_1 = require("../../helper/token.helper");
var role_const_1 = require("../../constants/role.const");
var error_1 = require("../../base/error");
var book_model_1 = require("../../models/book/book.model");
var book_service_1 = require("../../models/book/book.service");
var order_model_1 = require("../../models/order/order.model");
var model_const_1 = require("../../constants/model.const");
var shoppingCart_service_1 = require("../../models/shoppingCart/shoppingCart.service");
var shoppingCart_model_1 = require("../../models/shoppingCart/shoppingCart.model");
var utils_helper_1 = require("../../helper/utils.helper");
var invoice_model_1 = require("../../models/invoice/invoice.model");
var order_helper_1 = require("../../models/order/order.helper");
var wallet_model_1 = require("../../models/wallet/wallet.model");
var ShoppingCartRoute = /** @class */ (function (_super) {
    __extends(ShoppingCartRoute, _super);
    function ShoppingCartRoute() {
        return _super.call(this) || this;
    }
    ShoppingCartRoute.prototype.customRouting = function () {
        this.router.post("/getAllShoppingCart", [this.authentication], this.route(this.getAllShoppingCart));
        this.router.post("/getOneShoppingCart/:id", [this.authentication], this.route(this.getOneShoppingCart));
        this.router.post("/addBookToCart", [this.authentication], this.route(this.addBookToCart));
        this.router.post("/paymentShoppingCart", [this.authentication], this.route(this.paymentShoppingCart));
        this.router.post("/updateQuantityBookInCart", [this.authentication], this.route(this.updateQuantityBookInCart));
        this.router.post("/deleteProductInCart", [this.authentication], this.route(this.deleteProductInCart));
    };
    //Auth
    ShoppingCartRoute.prototype.authentication = function (req, res, next) {
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
    //getAllShoppingCart
    ShoppingCartRoute.prototype.getAllShoppingCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, limit, page, search, filter, shoppingCarts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
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
                        _a = req.body, limit = _a.limit, page = _a.page, search = _a.search;
                        if (!limit) {
                            limit = 10;
                        }
                        if (!page) {
                            page = 1;
                        }
                        filter = {
                            status: model_const_1.ShoppingCartStatusEnum.IN_CART,
                            userId: tokenData._id,
                        };
                        return [4 /*yield*/, shoppingCart_service_1.shoppingCartService.fetch({
                                filter: filter,
                                search: search,
                                limit: limit,
                                page: page,
                            }, ["user", "book"])];
                    case 1:
                        shoppingCarts = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: shoppingCarts,
                            })];
                }
            });
        });
    };
    //getOneShoppingCart
    ShoppingCartRoute.prototype.getOneShoppingCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, id, shoppingCart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        id = req.params.id;
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.findById(id)
                                .populate("user")
                                .populate("book")];
                    case 1:
                        shoppingCart = _a.sent();
                        if (!shoppingCart) {
                            //throw lỗi không tìm thấy
                            throw error_1.ErrorHelper.recoredNotFound("order!");
                        }
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    shoppingCart: shoppingCart,
                                },
                            })];
                }
            });
        });
    };
    ShoppingCartRoute.prototype.addBookToCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, bookId, quantity, book, shoppingCart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        _a = req.body, bookId = _a.bookId, quantity = _a.quantity;
                        if (!bookId || !quantity) {
                            throw error_1.ErrorHelper.requestDataInvalid("Invalid data!");
                        }
                        return [4 /*yield*/, book_model_1.BookModel.findById(bookId)];
                    case 1:
                        book = _b.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("book!");
                        }
                        if (book.quantity < quantity) {
                            throw error_1.ErrorHelper.forbidden("Out of stock!");
                        }
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.findOne({
                                userId: tokenData._id,
                                bookId: bookId,
                                status: model_const_1.ShoppingCartStatusEnum.IN_CART,
                            })];
                    case 2:
                        shoppingCart = _b.sent();
                        if (!shoppingCart) return [3 /*break*/, 4];
                        shoppingCart.quantity += quantity;
                        shoppingCart.initialCost += book.price * quantity;
                        return [4 /*yield*/, shoppingCart.save()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        shoppingCart = new shoppingCart_model_1.ShoppingCartModel({
                            bookId: bookId,
                            bookName: book.name,
                            quantity: quantity,
                            initialCost: book.price * quantity,
                            userId: tokenData._id,
                        });
                        return [4 /*yield*/, shoppingCart.save()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [4 /*yield*/, book_service_1.bookService.updateOne(book._id, {
                            $inc: {
                                quantity: -quantity,
                            },
                        })];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    shoppingCart: shoppingCart,
                                },
                            })];
                }
            });
        });
    };
    ShoppingCartRoute.prototype.paymentShoppingCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, shoppingCartIds, address, note, phoneNumber, paymentMethod, newPhone, shoppingCarts, initialCost, wallet, code, order, bookCategoryIds, invoice, MERCHANT_KEY, MERCHANT_SECRET_KEY, END_POINT, time, returnUrl, parameters, httpQuery, message, signature, baseEncode, httpBuild, buildHttpQuery, directUrl;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        _a = req.body, shoppingCartIds = _a.shoppingCartIds, address = _a.address, note = _a.note, phoneNumber = _a.phoneNumber, paymentMethod = _a.paymentMethod;
                        if (!shoppingCartIds ||
                            shoppingCartIds.length < 1 ||
                            !phoneNumber ||
                            !address) {
                            throw error_1.ErrorHelper.requestDataInvalid("Invalid data!");
                        }
                        newPhone = utils_helper_1.UtilsHelper.parsePhone(phoneNumber, "+84");
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.find({
                                _id: { $in: shoppingCartIds },
                            })];
                    case 1:
                        shoppingCarts = _b.sent();
                        if (shoppingCarts.length < 1) {
                            throw error_1.ErrorHelper.recoredNotFound("order!");
                        }
                        initialCost = 0;
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                initialCost += shoppingCart.initialCost;
                                return [2 /*return*/];
                            });
                        }); });
                        if (!(paymentMethod == model_const_1.PaymentMethodEnum.WALLET)) return [3 /*break*/, 3];
                        return [4 /*yield*/, wallet_model_1.WalletModel.findOne({ userId: tokenData._id })];
                    case 2:
                        wallet = _b.sent();
                        if (wallet.balance < initialCost + 20000) {
                            throw error_1.ErrorHelper.forbidden("Wallet balance is not enough!");
                        }
                        _b.label = 3;
                    case 3:
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        shoppingCart.status = model_const_1.ShoppingCartStatusEnum.SUCCESS;
                                        return [4 /*yield*/, shoppingCart.save()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, order_helper_1.OrderHelper.generateOrderCode()];
                    case 4:
                        code = _b.sent();
                        order = new order_model_1.OrderModel({
                            code: code,
                            userId: tokenData._id,
                            shoppingCartIds: shoppingCartIds,
                            phone: newPhone,
                            address: address,
                            note: note,
                            status: paymentMethod == "CASH"
                                ? model_const_1.OrderStatusEnum.PENDING
                                : model_const_1.OrderStatusEnum.UNPAID,
                            isPaid: paymentMethod == model_const_1.PaymentMethodEnum.ATM ? false : true,
                            shippingFee: 20000,
                            initialCost: initialCost,
                            finalCost: initialCost + 20000,
                            paymentMethod: paymentMethod || model_const_1.PaymentMethodEnum.CASH,
                            paymentStatus: paymentMethod == model_const_1.PaymentMethodEnum.ATM
                                ? model_const_1.PaymentStatusEnum.PENDING
                                : model_const_1.PaymentStatusEnum.SUCCESS,
                        });
                        return [4 /*yield*/, order.save()];
                    case 5:
                        _b.sent();
                        bookCategoryIds = [];
                        shoppingCarts.map(function (shoppingCart) { return __awaiter(_this, void 0, void 0, function () {
                            var book;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, book_model_1.BookModel.findById(shoppingCart.bookId)];
                                    case 1:
                                        book = _a.sent();
                                        bookCategoryIds.push(book.categoryId);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all([
                                user_model_1.UserModel.updateOne({ _id: order.userId }, {
                                    $addToSet: {
                                        searchs: {
                                            $each: bookCategoryIds,
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
                    case 6:
                        _b.sent();
                        if (!(paymentMethod == "ATM")) return [3 /*break*/, 11];
                        invoice = new invoice_model_1.InvoiceModel({
                            userId: tokenData._id,
                            amount: Number(order.finalCost),
                            type: "PAYMENT",
                            orderId: order._id,
                        });
                        return [4 /*yield*/, invoice.save()];
                    case 7:
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
                    case 8:
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
                    case 9:
                        signature = _b.sent();
                        baseEncode = Buffer.from(JSON.stringify(parameters)).toString("base64");
                        httpBuild = {
                            baseEncode: baseEncode,
                            signature: signature,
                        };
                        return [4 /*yield*/, utils_helper_1.UtilsHelper.buildHttpQuery(httpBuild)];
                    case 10:
                        buildHttpQuery = _b.sent();
                        directUrl = END_POINT + "/portal?" + buildHttpQuery;
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: { order: order, url: directUrl },
                            })];
                    case 11: return [2 /*return*/, res.status(200).json({
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
    ShoppingCartRoute.prototype.updateQuantityBookInCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, _a, shoppingCartId, quantity, shoppingCart, book;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        _a = req.body, shoppingCartId = _a.shoppingCartId, quantity = _a.quantity;
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.findById(shoppingCartId)];
                    case 1:
                        shoppingCart = _b.sent();
                        if (!shoppingCart) {
                            throw error_1.ErrorHelper.recoredNotFound("shoppingCart!");
                        }
                        return [4 /*yield*/, book_model_1.BookModel.findById(shoppingCart.bookId)];
                    case 2:
                        book = _b.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("book!");
                        }
                        if (!(quantity == 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, book_service_1.bookService.updateOne(book._id, {
                                $inc: {
                                    quantity: shoppingCart.quantity,
                                },
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.deleteOne(shoppingCart._id)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, shoppingCart_service_1.shoppingCartService.updateOne(shoppingCart._id, {
                            quantity: quantity,
                            initialCost: quantity * book.price,
                            finalCost: quantity * book.price,
                        })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [4 /*yield*/, book.save()];
                    case 8:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    shoppingCart: shoppingCart,
                                },
                            })];
                }
            });
        });
    };
    ShoppingCartRoute.prototype.deleteProductInCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, shoppingCartId, shoppingCart, book;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenData = token_helper_1.TokenHelper.decodeToken(req.get("x-token"));
                        if (!tokenData) {
                            throw error_1.ErrorHelper.unauthorized();
                        }
                        shoppingCartId = req.body.shoppingCartId;
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.findById(shoppingCartId)];
                    case 1:
                        shoppingCart = _a.sent();
                        if (!shoppingCart) {
                            throw error_1.ErrorHelper.recoredNotFound("shoppingCart!");
                        }
                        return [4 /*yield*/, book_model_1.BookModel.findById(shoppingCart.bookId)];
                    case 2:
                        book = _a.sent();
                        if (!book) {
                            throw error_1.ErrorHelper.recoredNotFound("book!");
                        }
                        return [4 /*yield*/, book_service_1.bookService.updateOne(book._id, {
                                $inc: {
                                    quantity: shoppingCart.quantity,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, shoppingCart_model_1.ShoppingCartModel.deleteOne(shoppingCart._id)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    shoppingCart: shoppingCart,
                                },
                            })];
                }
            });
        });
    };
    return ShoppingCartRoute;
}(baseRoute_1.BaseRoute));
exports.default = new ShoppingCartRoute().router;
//# sourceMappingURL=shoppingCart.route.js.map