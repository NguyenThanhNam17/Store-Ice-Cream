"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRoute = void 0;
var express_1 = __importDefault(require("express"));
var resError_1 = require("../helper/resError");
var BaseRoute = /** @class */ (function () {
    function BaseRoute() {
        this.router = express_1.default.Router();
        this.customRouting();
    }
    BaseRoute.prototype.route = function (func) {
        var _this = this;
        return function (req, res, next) {
            return func
                .bind(_this)(req, res, next)
                .catch(function (error) {
                _this.resError(res, error);
            });
        };
    };
    BaseRoute.prototype.resError = function (res, error) {
        return (0, resError_1.resError)(res, error);
    };
    return BaseRoute;
}());
exports.BaseRoute = BaseRoute;
//# sourceMappingURL=baseRoute.js.map