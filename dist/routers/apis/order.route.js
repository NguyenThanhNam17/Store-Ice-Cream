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
var error_1 = require("../../base/error");
var baseRoute_1 = require("../../base/baseRoute");
var role_const_1 = require("../../constants/role.const");
var token_helper_1 = require("../../helper/token.helper");
var user_model_1 = require("../../models/user/user.model");
var model_const_1 = require("../../constants/model.const");
var order_model_1 = require("../../models/order/order.model");
var cart_model_1 = require("../../models/cart/cart.model");
var product_model_1 = require("../../models/product/product.model");
var wallet_model_1 = require("../../models/wallet/wallet.model");
var OrderRoute = /** @class */ (function (_super) {
    __extends(OrderRoute, _super);
    function OrderRoute() {
        return _super.call(this) || this;
    }
    OrderRoute.prototype.customRouting = function () {
        this.router.post("/createOrder", [this.route(this.authentication)], this.route(this.createOrder));
        this.router.post("/updateStatusOrder", [this.route(this.authentication)], this.route(this.updateStatusOrder));
        this.router.get("/getListOrder", [this.route(this.authentication)], this.route(this.getListOrder));
        this.router.get("/getOneOrder/:id", [
            this.route(this.authentication),
            this.route(this.getOneOrder),
        ]);
        this.router.post("/cancelOrder", [
            this.route(this.authentication),
            this.route(this.cancelOrder),
        ]);
        this.router.post("/deleteOneOrder", [
            this.route(this.authentication),
            this.route(this.deleteOneOrder),
        ]);
    };
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
                        if (![role_const_1.ROLES.ADMIN, role_const_1.ROLES.CLIENT].includes(tokenData.role_)) return [3 /*break*/, 2];
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
                        throw error_1.ErrorHelper.unauthorized();
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderRoute.prototype.createOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, cartIds, paymentMethod, carts, totalPrice, user, wallet, order;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, cartIds = _a.cartIds, paymentMethod = _a.paymentMethod;
                        if (cartIds.length == 0 || !paymentMethod) {
                            throw error_1.ErrorHelper.requestDataInvalid("invalid data");
                        }
                        return [4 /*yield*/, cart_model_1.CartModel.find({ _id: { $in: cartIds } })];
                    case 1:
                        carts = _b.sent();
                        if (!carts) {
                            throw error_1.ErrorHelper.forbidden("không tồn tại cart");
                        }
                        totalPrice = 0;
                        return [4 /*yield*/, Promise.all(carts.map(function (cart) { return __awaiter(_this, void 0, void 0, function () {
                                var product;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, product_model_1.ProductModel.findById(cart.productId)];
                                        case 1:
                                            product = _a.sent();
                                            totalPrice += cart.quantity * product.price;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user_model_1.UserModel.findById(req.tokenInfo._id)];
                    case 3:
                        user = _b.sent();
                        if (!(paymentMethod == "WALLET")) return [3 /*break*/, 6];
                        return [4 /*yield*/, wallet_model_1.WalletModel.findById(user.walletId)];
                    case 4:
                        wallet = _b.sent();
                        if (wallet.balance < totalPrice) {
                            throw error_1.ErrorHelper.forbidden("Không đủ số dư");
                        }
                        return [4 /*yield*/, wallet_model_1.WalletModel.updateOne({ _id: wallet.id }, {
                                $inc: {
                                    balance: -totalPrice
                                }
                            })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        order = new order_model_1.OrderModel({
                            userId: req.tokenInfo._id,
                            cartIds: cartIds,
                            paymentMethod: paymentMethod,
                            status: model_const_1.OrderStatusEnum.PENDING,
                            totalPrice: totalPrice,
                            isPaid: paymentMethod == "CASH" ? false : true,
                        });
                        return [4 /*yield*/, order.save()];
                    case 7:
                        _b.sent();
                        // Cập nhật trạng thái của các giỏ hàng đã dùng thành SUCCESS
                        return [4 /*yield*/, cart_model_1.CartModel.updateMany({ _id: { $in: cartIds } }, { $set: { status: model_const_1.CartStatusEnum.SUCCESS } })];
                    case 8:
                        // Cập nhật trạng thái của các giỏ hàng đã dùng thành SUCCESS
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
    OrderRoute.prototype.getListOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, order_model_1.OrderModel.find({ userId: req.tokenInfo._id })];
                    case 1:
                        list = _a.sent();
                        if (!list) {
                            throw error_1.ErrorHelper.requestDataInvalid("Khong co order");
                        }
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    list: list,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.getOneOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw error_1.ErrorHelper.requestDataInvalid("Khong co order");
                        }
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    result: result,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.updateStatusOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, orderId, status, order;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, orderId = _a.orderId, status = _a.status;
                        if (!orderId || !status) {
                            throw error_1.ErrorHelper.requestDataInvalid("Thiếu orderId hoặc status");
                        }
                        if (req.tokenInfo.role_ != role_const_1.ROLES.ADMIN) {
                            throw error_1.ErrorHelper.permissionDeny();
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.findById(orderId)];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.forbidden("Đơn hàng không tồn tại");
                        }
                        if (![
                            model_const_1.OrderStatusEnum.FAILED,
                            model_const_1.OrderStatusEnum.PENDING,
                            model_const_1.OrderStatusEnum.SUCCESS,
                        ].includes(status)) {
                            throw error_1.ErrorHelper.requestDataInvalid("Trạng thái không hợp lệ");
                        }
                        order.status = status;
                        return [4 /*yield*/, order.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.cancelOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("Order");
                        }
                        order.status = model_const_1.OrderStatusEnum.FAILED;
                        return [4 /*yield*/, order.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    OrderRoute.prototype.deleteOneOrder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        return [4 /*yield*/, order_model_1.OrderModel.findById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw error_1.ErrorHelper.recoredNotFound("order");
                        }
                        return [4 /*yield*/, order_model_1.OrderModel.deleteOne({ _id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    order: order,
                                },
                            })];
                }
            });
        });
    };
    return OrderRoute;
}(baseRoute_1.BaseRoute));
exports.default = new OrderRoute().router;
//# sourceMappingURL=order.route.js.map