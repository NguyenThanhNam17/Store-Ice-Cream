"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartStatusEnum = exports.OrderStatusEnum = exports.PaymentMethodEnum = exports.TransStatusEnum = exports.UserRoleEnum = void 0;
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["CLIENT"] = "CLIENT";
    // STAFF = "STAFF",
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var TransStatusEnum;
(function (TransStatusEnum) {
    TransStatusEnum["PENDING"] = "PENDING";
    TransStatusEnum["SUCCESS"] = "SUCCESS";
    TransStatusEnum["FAILED"] = "FAILED";
})(TransStatusEnum || (exports.TransStatusEnum = TransStatusEnum = {}));
var PaymentMethodEnum;
(function (PaymentMethodEnum) {
    PaymentMethodEnum["CASH"] = "CASH";
})(PaymentMethodEnum || (exports.PaymentMethodEnum = PaymentMethodEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["PENDING"] = "PENDING";
    OrderStatusEnum["SUCCESS"] = "SUCCESS";
    OrderStatusEnum["FAILED"] = "FAILED";
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
var CartStatusEnum;
(function (CartStatusEnum) {
    CartStatusEnum["PENDING"] = "PENDING";
    CartStatusEnum["SUCCESS"] = "SUCCESS";
})(CartStatusEnum || (exports.CartStatusEnum = CartStatusEnum = {}));
//# sourceMappingURL=model.const.js.map