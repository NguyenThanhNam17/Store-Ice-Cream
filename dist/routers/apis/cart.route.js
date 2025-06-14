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
var cart_model_1 = require("../../models/cart/cart.model");
var token_helper_1 = require("../../helper/token.helper");
var role_const_1 = require("../../constants/role.const");
var user_model_1 = require("../../models/user/user.model");
var product_model_1 = require("../../models/product/product.model");
var model_const_1 = require("../../constants/model.const");
var CartRoute = /** @class */ (function (_super) {
    __extends(CartRoute, _super);
    function CartRoute() {
        return _super.call(this) || this;
    }
    CartRoute.prototype.customRouting = function () {
        this.router.get("/getAllCart", [this.authentication], this.route(this.getAllCart));
        this.router.post("/addCartProductToCart", [this.authentication], this.route(this.addCartProductToCart));
        this.router.post("/deleteCartProductToCart", [this.authentication], this.route(this.deleteCartProductToCart));
        this.router.post("/updateCartProductToCart", [this.authentication], this.route(this.updateCartProductToCart));
    };
    CartRoute.prototype.authentication = function (req, res, next) {
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
    CartRoute.prototype.getAllCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var carts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cart_model_1.CartModel.find({
                            userId: req.tokenInfo._id,
                            status: model_const_1.CartStatusEnum.PENDING,
                        })];
                    case 1:
                        carts = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    carts: carts,
                                },
                            })];
                }
            });
        });
    };
    CartRoute.prototype.addCartProductToCart = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, productId, quantity, checkProduct, cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, productId = _a.productId, quantity = _a.quantity;
                        if (!productId || !quantity) {
                            throw error_1.ErrorHelper.requestDataInvalid("product");
                        }
                        return [4 /*yield*/, product_model_1.ProductModel.findById(productId)];
                    case 1:
                        checkProduct = _b.sent();
                        if (!checkProduct) {
                            throw error_1.ErrorHelper.requestDataInvalid("product");
                        }
                        cart = new cart_model_1.CartModel({
                            productId: productId,
                            userId: req.tokenInfo._id,
                            quantity: quantity,
                        });
                        return [4 /*yield*/, cart.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "success",
                                data: {
                                    cart: cart,
                                },
                            })];
                }
            });
        });
    };
    CartRoute.prototype.deleteCartProductToCart = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, cart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        return [4 /*yield*/, cart_model_1.CartModel.findById(id)];
                    case 1:
                        cart = _a.sent();
                        if (!cart) {
                            throw error_1.ErrorHelper.recoredNotFound("cart");
                        }
                        return [4 /*yield*/, cart_model_1.CartModel.deleteOne({ _id: id })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    cart: cart
                                }
                            })];
                }
            });
        });
    };
    CartRoute.prototype.updateCartProductToCart = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, quantity, productId, cart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, quantity = _a.quantity, productId = _a.productId;
                        if (!id || !quantity || !productId) {
                            throw error_1.ErrorHelper.requestDataInvalid("invalid");
                        }
                        return [4 /*yield*/, cart_model_1.CartModel.findById(id)];
                    case 1:
                        cart = _b.sent();
                        if (!cart) {
                            throw error_1.ErrorHelper.recoredNotFound("cart");
                        }
                        cart.productId = productId || cart.productId;
                        cart.quantity = quantity || cart.quantity;
                        return [4 /*yield*/, cart.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                status: 200,
                                code: "200",
                                message: "succes",
                                data: {
                                    cart: cart
                                }
                            })];
                }
            });
        });
    };
    return CartRoute;
}(baseRoute_1.BaseRoute));
exports.default = new CartRoute().router;
//# sourceMappingURL=cart.route.js.map