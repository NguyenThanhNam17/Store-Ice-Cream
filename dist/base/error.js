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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHelper = exports.BaseError = void 0;
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(status, code, message, data) {
        var _this = _super.call(this, message) || this;
        _this.info = { status: status, code: code, message: message, data: data };
        return _this;
    }
    return BaseError;
}(Error));
exports.BaseError = BaseError;
var ErrorHelper = /** @class */ (function (_super) {
    __extends(ErrorHelper, _super);
    function ErrorHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Auth
    ErrorHelper.unauthorized = function () {
        return new BaseError(401, "401", "Vui lòng đăng nhập");
    };
    ErrorHelper.permissionDeny = function () {
        return new BaseError(405, "-2", "Không đủ quyền để truy cập");
    };
    // Request
    ErrorHelper.requestDataInvalid = function (message) {
        return new BaseError(403, "-3", "Dữ liệu gửi lên không hợp lệ", message);
    };
    ErrorHelper.recoredNotFound = function (message) {
        return new BaseError(404, "-10", "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u y\u00EAu c\u1EA7u: ".concat(message));
    };
    ErrorHelper.userWasOut = function () {
        return new BaseError(401, "-4", "Phiên đăng nhập của bạn đã hết hạn");
    };
    ErrorHelper.userWasBlock = function () {
        return new BaseError(401, "-5", "Tài khoản của bạn đã bị Khóa vui lòng liên hệ Admin");
    };
    ErrorHelper.userNotExist = function () {
        return new BaseError(403, "-6", "Người dùng không tồn tại");
    };
    ErrorHelper.userExisted = function () {
        return new BaseError(403, "-7", "Người dùng đã tồn tại");
    };
    ErrorHelper.userPasswordNotCorrect = function () {
        return new BaseError(403, "-8", "M\u1EADt kh\u1EA9u kh\u00F4ng \u0111\u00FAng.");
    };
    ErrorHelper.forbidden = function (message) {
        return new BaseError(403, "-9", message);
    };
    // Unknow
    ErrorHelper.somethingWentWrong = function (message) {
        return new BaseError(500, "-10", message || "Có lỗi xảy ra");
    };
    return ErrorHelper;
}(BaseError));
exports.ErrorHelper = ErrorHelper;
//# sourceMappingURL=error.js.map